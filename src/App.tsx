import { Sword, LayoutDashboard, User, ShieldQuestion, Moon, Sun, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { Theme, View } from '@/src/types';
import { auth, db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Components
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import HomeView from '@/src/components/HomeView';
import BuyKeyView from '@/src/components/BuyKeyView';
import ProfileView from '@/src/components/ProfileView';
import SupportView from '@/src/components/SupportView';
import LegalView from '@/src/components/LegalView';
import AdminView from '@/src/components/AdminView';
import LoadingScreen from '@/src/components/LoadingScreen';
import LoginGate from '@/src/components/LoginGate';
import MobileDrawer from '@/src/components/MobileDrawer';
import HistoryView from '@/src/components/HistoryView';
import KeysView from '@/src/components/KeysView';
import ChatView from '@/src/components/ChatView';

export default function App() {
  const [theme, setTheme] = useState<Theme>('cosmic');
  const [currentView, setCurrentView] = useState<View>('home');
  const [user, setUser] = useState<{ firebase: FirebaseUser, isAdmin: boolean } | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // Fail-safe for auth check to prevent infinite loading
    const authTimeout = setTimeout(() => {
      setIsAuthChecking(false);
    }, 1000);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      clearTimeout(authTimeout); // Auth responded, clear initial fail-safe
      
      if (u) {
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          
          let isAdmin = u.email === 'dev728132@gmail.com';
          
          if (!(userDoc as any).exists()) {
            const rawUsername = u.displayName || u.email?.split('@')[0] || `user_${u.uid.slice(0, 5)}`;
            const cleanUsername = rawUsername.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20);
            const finalUsername = cleanUsername.length >= 3 ? cleanUsername : `user_${u.uid.slice(0, 8)}`;

            await setDoc(doc(db, 'users', u.uid), {
              uid: u.uid,
              email: u.email,
              username: finalUsername,
              displayName: u.displayName || finalUsername,
              isAdmin: isAdmin,
              createdAt: serverTimestamp(),
              lastActive: serverTimestamp(),
            });

            // Ensure username mapping exists
            await setDoc(doc(db, 'usernames', finalUsername), {
              uid: u.uid,
              email: u.email
            }, { merge: true });
          } else {
            isAdmin = userDoc.data().isAdmin || isAdmin;
            await setDoc(doc(db, 'users', u.uid), {
              lastActive: serverTimestamp(),
            }, { merge: true });
          }

          const adminDoc = await getDoc(doc(db, 'admins', u.uid));
          if (adminDoc.exists()) isAdmin = true;

          setUser({ firebase: u, isAdmin });
        } catch (error: any) {
          if (error.code !== 'unavailable' && !error.message?.includes('offline')) {
            console.error("Auth process error:", error);
          }
          setUser({ firebase: u, isAdmin: false }); // Fallback
        }
      } else {
        setUser(null);
      }
      setIsAuthChecking(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(authTimeout);
    };
  }, []);

  const handleLogin = () => {
    // Login logic is now handled inside LoginGate
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView('home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'slate' ? 'cosmic' : 'slate'));
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 flex flex-col",
      theme === 'cosmic' ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      <AnimatePresence mode="wait">
        {isAuthChecking ? null : !user ? (
          <LoginGate key="login" theme={theme} onLogin={handleLogin} />
        ) : null}
      </AnimatePresence>

      {user && !isAuthChecking && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col min-h-screen"
        >
          <Header 
            theme={theme} 
            currentView={currentView} 
            onViewChange={setCurrentView} 
            onToggleTheme={toggleTheme}
            user={user?.firebase || null}
            onLogin={handleLogin}
            onOpenMenu={() => setIsDrawerOpen(true)}
          />

          <MobileDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            currentView={currentView}
            onViewChange={setCurrentView}
            theme={theme}
            onLogout={handleLogout}
            user={user}
          />

          <main className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {currentView === 'home' && <HomeView theme={theme} user={user} onLogin={handleLogin} />}
                {currentView === 'buy' && <BuyKeyView theme={theme} user={user} onLogin={handleLogin} />}
                {currentView === 'profile' && <ProfileView theme={theme} user={user} onLogout={handleLogout} onViewChange={setCurrentView} />}
                {currentView === 'support' && <SupportView theme={theme} />}
                {currentView === 'chat' && <ChatView theme={theme} user={user} />}
                {currentView === 'privacy' && <LegalView theme={theme} type="privacy" />}
                {currentView === 'terms' && <LegalView theme={theme} type="terms" />}
                {currentView === 'contact' && <LegalView theme={theme} type="contact" />}
                {currentView === 'admin' && user?.isAdmin && <AdminView theme={theme} />}
                
                {currentView === 'history' && <HistoryView theme={theme} user={user} />}
                {currentView === 'my-keys' && <KeysView theme={theme} user={user} />}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer theme={theme} onViewChange={setCurrentView} />
        </motion.div>
      )}
    </div>
  );
}
