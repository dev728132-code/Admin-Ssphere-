import { Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { signInWithGoogle } from '@/src/lib/firebase';
import Logo from './Logo';

export default function LoginGate({ theme }: { theme: any, onLogin?: () => void, key?: string }) {
  const isCosmic = theme === 'cosmic';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-[80] flex flex-col items-center justify-center p-6 transition-colors duration-500 overflow-y-auto",
        isCosmic ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      )}
    >
      {/* Background Ambience */}
      {isCosmic && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cosmic-blue/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cosmic-indigo/5 blur-[120px] rounded-full" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "max-w-md w-full p-8 md:p-10 rounded-[2.5rem] border relative z-10 space-y-8 my-auto",
          isCosmic ? "bg-slate-900/50 border-slate-800 backdrop-blur-xl" : "bg-white border-slate-200 shadow-2xl"
        )}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo size={48} theme={theme} />
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
              Operative <span className="text-cosmic-blue">Login</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              Authentication Protocol
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-xs font-bold"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={cn(
            "w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 border transition-all",
            isCosmic 
              ? "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-cosmic-blue/50 hover:text-white" 
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
            loading && "opacity-50 cursor-wait"
          )}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.69-2.28 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.14c-.22-.66-.35-1.36-.35-2.14s.13-1.48.35-2.14V7.02H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.98l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.02l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          CONTINUE WITH GOOGLE
        </motion.button>

        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center pt-2">
          Terminal Protection v4.2 Active
        </p>
      </motion.div>
    </motion.div>
  );
}
