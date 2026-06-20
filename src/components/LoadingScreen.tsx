import { Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import Logo from './Logo';

export default function LoadingScreen({ theme }: { theme: Theme, key?: string }) {
  const isCosmic = theme === 'cosmic';
  
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center transition-colors duration-500",
        isCosmic ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        <Logo size={120} theme={theme} />
        
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-display text-2xl font-bold tracking-[0.2em] uppercase"
          >
            NOVAFF <span className="text-cosmic-blue">ELITE</span>
          </motion.h1>
          
          <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute inset-0 bg-cosmic-blue"
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-500"
          >
            Initializing Secure Kernel Environment...
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
