import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithPopup
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '@/firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// Helper for timeout-guarded operations
async function withTimeout<T>(operation: () => Promise<T>, timeoutMs: number = 8000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Network request timed out. Please check your connection.')), timeoutMs);
  });
  return Promise.race([operation(), timeoutPromise]);
}

export async function registerWithUsername(username: string, email: string, pass: string) {
  // 1. Check if username exists
  const usernameLower = username.trim().toLowerCase();
  const userRef = doc(db, 'usernames', usernameLower);
  
  try {
    const userSnap = await withTimeout(() => getDoc(userRef));
    if (userSnap.exists()) {
      throw new Error('Username already taken');
    }
  } catch (err: any) {
    // If it's a legitimate "not found" error, we continue. 
    // "document not found" on getDocFromServer is actually a successful fetch that returned no data.
    if (err.code !== 'not-found' && !err.message.includes('not found') && !err.message.includes('timed out')) {
      console.warn('Username check warning:', err);
    }
    if (err.message.includes('taken')) throw err;
  }

  // 2. Create Auth User
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  // Set display name in Firebase Auth
  await updateProfile(user, { displayName: username });

  // 3. Save to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: email,
    username: usernameLower,
    displayName: username,
    isAdmin: false,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp()
  });

  await setDoc(doc(db, 'usernames', usernameLower), {
    uid: user.uid,
    email: email
  });

  return user;
}

export async function loginWithUsername(username: string, pass: string) {
  // 1. Find email by username
  const usernameLower = username.trim().toLowerCase();
  const userRef = doc(db, 'usernames', usernameLower);
  
  let email: string;
  try {
    const userSnap = await withTimeout(() => getDoc(userRef));
    if (!userSnap.exists()) {
      throw new Error('User protocol not found. Please register.');
    }
    email = userSnap.data().email;
  } catch (err: any) {
    if (err.message.includes('timed out')) {
       throw new Error('Signal lost during authentication. Retry protocol.');
    }
    throw err;
  }

  // 2. Login with email
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
