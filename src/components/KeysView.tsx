import { Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { Key, Copy, CheckCircle2, ShieldCheck, Zap, Hash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/src/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface UserKey {
  id: string;
  productName: string;
  key: string;
  expiry: string;
  status: 'Active' | 'Expired';
  userName?: string;
  userEmail?: string;
}

export default function KeysView({ theme, user }: { theme: Theme, user: any }) {
  const isCosmic = theme === 'cosmic';
  const [userKeys, setUserKeys] = useState<UserKey[]>([]);

  useEffect(() => {
    if (!user?.firebase?.uid) {
      return;
    }

    const q = query(
      collection(db, 'payments'),
      where('uid', '==', user.firebase.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ps = snapshot.docs
        .filter(doc => doc.data().status === 'verified' || doc.data().status === 'approved')
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            productName: data.productName || 'Elite Blade FF Non Root',
            key: `NV-ELITE-${doc.id.slice(0, 4).toUpperCase()}-${doc.id.slice(4, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`,
            expiry: 'LIFETIME ACCESS',
            status: 'Active' as const,
            userName: data.userName || user.firebase.displayName || 'Unknown',
            userEmail: data.userEmail || user.firebase.email || 'Unknown',
            _timestamp: data.timestamp?.toMillis() || Date.now()
          };
      }).sort((a, b) => b._timestamp - a._timestamp);
      setUserKeys(ps);
    }, (error) => {
      console.error(error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className={cn(
          "font-display text-3xl font-bold uppercase tracking-tight",
          isCosmic ? "text-white" : "text-slate-900"
        )}>
          My <span className="text-cosmic-blue">Keys</span>
        </h2>
        <p className={cn(
          "text-sm uppercase tracking-[0.2em] font-bold opacity-60",
          isCosmic ? "text-slate-400" : "text-slate-500"
        )}>
          Active Licenses & Credentials
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {userKeys.length === 0 ? (
          <div className={cn(
            "p-12 rounded-[2.5rem] border border-dashed text-center flex flex-col items-center gap-4",
            isCosmic ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
          )}>
            <div className="p-4 rounded-full bg-slate-800/50 text-slate-500">
              <Hash size={32} />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">No key purchased.</p>
          </div>
        ) : (
          userKeys.map((k) => (
            <motion.div
              key={k.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "p-8 rounded-[2.5rem] border relative overflow-hidden group",
                isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xl"
              )}
            >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic-blue/5 blur-3xl rounded-full" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    isCosmic ? "bg-cosmic-blue/10 text-cosmic-blue" : "bg-slate-100 text-slate-900"
                  )}>
                    <Key size={24} />
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-display font-bold uppercase tracking-tight",
                      isCosmic ? "text-white" : "text-slate-900"
                    )}>{k.productName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Authorized To: {k.userName}</span>
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                  k.status === 'Active' 
                    ? "bg-green-500/10 text-green-500 border-green-500/20" 
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                )}>
                  {k.status}
                </div>
              </div>

              <div className={cn(
                "p-6 rounded-2xl border flex items-center justify-between gap-4",
                isCosmic ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-100"
              )}>
                <div className="font-mono text-sm tracking-widest text-slate-400 truncate">
                  {k.key}
                </div>
                <button 
                  onClick={() => handleCopy(k.key)}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    isCosmic ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-white hover:bg-slate-100 text-slate-600 shadow-sm"
                  )}
                >
                  <Copy size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={cn(
                  "p-4 rounded-xl border flex flex-col gap-1",
                  isCosmic ? "bg-slate-900/40 border-slate-800/60" : "bg-slate-50/50 border-slate-100"
                )}>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em]">Expires On</span>
                  <span className={cn(
                    "text-sm font-bold",
                    isCosmic ? "text-slate-200" : "text-slate-700"
                  )}>{k.expiry}</span>
                </div>
                <div className={cn(
                  "p-4 rounded-xl border flex flex-col gap-1",
                  isCosmic ? "bg-slate-900/40 border-slate-800/60" : "bg-slate-50/50 border-slate-100"
                )}>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em]">Security Level</span>
                  <div className="flex items-center gap-1.5 text-cosmic-blue">
                    <ShieldCheck size={14} />
                    <span className="text-sm font-bold uppercase tracking-wider">Elite</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Zap size={12} className="text-cosmic-blue" />
                Key bound to primary HWID configuration
              </div>
            </div>
          </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
