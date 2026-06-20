import { 
  LayoutDashboard, 
  ShoppingCart, 
  Key, 
  History as HistoryIcon, 
  Share2, 
  User, 
  Headphones, 
  LogOut,
  X,
  Bot
} from 'lucide-react';
import { Theme, View } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
  theme: Theme;
  onLogout: () => void;
  user: any;
}

export default function MobileDrawer({ 
  isOpen, 
  onClose, 
  currentView, 
  onViewChange, 
  theme, 
  onLogout,
  user
}: MobileDrawerProps) {
  const isCosmic = theme === 'cosmic';

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'buy', label: 'Buy Keys', icon: ShoppingCart },
    { id: 'my-keys', label: 'My Keys', icon: Key },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'chat', label: 'Chatbot', icon: Bot },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  const handleNavItemClick = (view: View) => {
    onViewChange(view);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[90]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 left-0 bottom-0 w-72 z-[100] border-r flex flex-col",
              isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo size={24} theme={theme} />
                <span className={cn(
                  "font-display font-bold uppercase tracking-tight text-sm",
                  isCosmic ? "text-white" : "text-slate-900"
                )}>
                  Genesis <span className="text-cosmic-blue">AI</span>
                </span>
              </div>
              <button 
                onClick={onClose}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isCosmic ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                )}
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-grow overflow-y-auto py-6 px-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavItemClick(item.id as View)}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group",
                      isActive
                        ? (isCosmic ? "bg-cosmic-blue text-slate-950 font-bold" : "bg-slate-900 text-white font-bold")
                        : (isCosmic ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")
                    )}
                  >
                    <Icon size={20} className={cn(isActive ? "" : "group-hover:scale-110 transition-transform")} />
                    <span className="text-sm uppercase tracking-wider">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer / User Info */}
            <div className={cn(
              "p-6 border-t",
              isCosmic ? "border-slate-800" : "border-slate-200"
            )}>
              {user && (
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cosmic-blue/20 flex items-center justify-center border border-cosmic-blue/30 overflow-hidden">
                    {user.firebase.photoURL ? (
                      <img src={user.firebase.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-cosmic-blue" />
                    )}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <div className={cn(
                      "text-xs font-bold uppercase truncate",
                      isCosmic ? "text-white" : "text-slate-900"
                    )}>
                      {user.firebase.displayName || 'Operative'}
                    </div>
                    <div className="text-[10px] text-cosmic-blue font-bold uppercase tracking-widest opacity-80">
                      Elite Status
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={onLogout}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-red-500 hover:bg-red-500/10 font-bold",
                )}
              >
                <LogOut size={20} />
                <span className="text-sm uppercase tracking-wider">Secure Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
