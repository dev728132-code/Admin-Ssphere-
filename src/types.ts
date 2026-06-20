export type Theme = 'slate' | 'cosmic';
export type View = 'home' | 'buy' | 'profile' | 'support' | 'privacy' | 'terms' | 'contact' | 'admin' | 'my-keys' | 'history' | 'chat';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  priceValue: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  isComingSoon: boolean;
  plans?: SubscriptionPlan[];
}

export interface UserActivity {
  id: string;
  action: string;
  timestamp: Date;
  details?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isElite: boolean;
  isVerified: boolean;
  latency: string;
  node: string;
  sessionType: string;
}
