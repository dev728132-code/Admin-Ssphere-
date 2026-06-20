import { Home, ShoppingCart, Headphones, User, Moon, Sun, LogIn, Menu } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { View, Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import React from 'react';
import Logo from './Logo';

interface HeaderProps {
  theme: Theme;
  currentView: View;
  onViewChange: (view: View) => void;
  onToggleTheme: () => void;
  user: FirebaseUser | null;
  onLogin: () => void;
  onOpenMenu?: () => void;
}

export default function Header({ theme, currentView, onViewChange, onToggleTheme, user, onLogin, onOpenMenu }: HeaderProps) {
  const isCosmic = theme === 'cosmic';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 h-20 px-6 md:px-12 backdrop-blur-md border-b",
      isCosmic ? "bg-slate-900/60 border-slate-800" : "bg-white/60 border-slate-200"
    )}>
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand (Logo) */}
        <div className="flex items-center gap-4">
          {user && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onOpenMenu}
              className={cn(
                "p-2.5 rounded-lg border transition-all",
                isCosmic 
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Menu size={22} />
            </motion.button>
          )}
          <div 
            onClick={() => onViewChange('home')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              className={cn(
                "p-1.5 rounded-xl border flex items-center justify-center",
                isCosmic ? "bg-cosmic-blue/10 border-cosmic-blue/20" : "bg-slate-50 border-slate-200"
              )}
            >
              <Logo size={20} theme={theme} />
            </motion.div>
            <span className={cn(
              "font-display text-xl font-bold tracking-tight uppercase",
              isCosmic ? "text-white" : "text-slate-900"
            )}>
              Genesis <span className="text-cosmic-blue">AI</span>
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className={cn(
              "p-2.5 rounded-full border transition-all",
              isCosmic 
                ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            {isCosmic ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {!user && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogin}
              className={cn(
                "px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 text-sm transition-all shadow-sm",
                isCosmic 
                  ? "bg-cosmic-blue text-slate-950 hover:shadow-[0_0_20px_rgba(0,210,255,0.4)]" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
              )}
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">LOGIN</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ active, onClick, icon, label, theme }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, theme: Theme }) {
  const isCosmic = theme === 'cosmic';
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium",
        active 
          ? (isCosmic ? "bg-cosmic-blue text-slate-950 font-bold" : "bg-white text-slate-900 shadow-sm")
          : (isCosmic ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")
      )}
    >
      {icon}
      {label}
    </button>
  );
}
