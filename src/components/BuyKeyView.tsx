import { useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { Theme, SubscriptionPlan } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ShoppingCart, Lock, ShieldCheck, Minus, Plus } from 'lucide-react';
import PaymentModal from '@/src/components/PaymentModal';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import Logo from './Logo';

const PLANS: SubscriptionPlan[] = [
  { id: '1d', name: '1 Day', price: '₹70', duration: '24 Hours', priceValue: 70 },
  { id: '3d', name: '3 Days', price: '₹150', duration: '72 Hours', priceValue: 150 },
  { id: '7d', name: '7 Days', price: '₹300', duration: '168 Hours', priceValue: 300 },
  { id: '15d', name: '15 Days', price: '₹499', duration: '360 Hours', priceValue: 499 },
  { id: '30d', name: '30 Days', price: '₹799', duration: '720 Hours', priceValue: 799 },
];

export default function BuyKeyView({ theme, user, onLogin }: { theme: Theme, user: any, onLogin: () => void }) {
  const isCosmic = theme === 'cosmic';
  const [productSelected, setProductSelected] = useState(false);
  const [plansExpanded, setPlansExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(PLANS.map(p => [p.id, 1]))
  );

  const handleBuy = (plan: SubscriptionPlan) => {
    if (!user) {
      onLogin();
      return;
    }
    
    const qty = quantities[plan.id];
    const finalPlan = {
      ...plan,
      price: `₹${plan.priceValue * qty}`,
      name: `${plan.name} (${qty}x)`
    };
    
    setSelectedPlan(finalPlan);
    
    // Log activity
    addDoc(collection(db, 'activities'), {
      uid: user.firebase.uid,
      action: `Initiated purchase for ${plan.name} plan (Qty: ${qty})`,
      timestamp: serverTimestamp(),
      details: 'Elite Blade FF Non Root'
    });
  };

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, Math.min(10, prev[id] + delta))
    }));
  };

  return (
    <div className="space-y-12 pb-20">
      <section className="text-center space-y-6 flex flex-col items-center">
        <Logo size={32} theme={theme} className="mb-2" />
        <div className="space-y-4">
          <h2 className={cn(
            "font-display text-4xl font-bold uppercase tracking-tight",
            isCosmic ? "text-white" : "text-slate-900"
          )}>Elite <span className="text-cosmic-blue">Armory</span></h2>
          <p className="text-slate-500 max-w-xl mx-auto uppercase text-[10px] font-bold tracking-[0.2em]">Secure License Deployment Terminal</p>
        </div>
      </section>

      {/* Active Product - Compact Version */}
      <div className="max-w-3xl mx-auto space-y-4">
        <motion.div
          layout
          onClick={() => {
            if (productSelected || plansExpanded) {
              setProductSelected(false);
              setPlansExpanded(false);
            } else {
              setProductSelected(true);
            }
          }}
          className={cn(
            "p-4 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.01]",
            isCosmic 
              ? "bg-slate-900 border-slate-800 hover:border-cosmic-blue/50" 
              : "bg-white border-slate-200 shadow-lg hover:border-slate-300",
            productSelected && (isCosmic ? "border-cosmic-blue/50" : "border-slate-400 shadow-md")
          )}
        >
          <div className="flex items-center gap-6">
            <div className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0",
              isCosmic ? "bg-slate-800/50" : "bg-slate-50"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-cosmic-blue/10 to-transparent opacity-40" />
              <Logo size={32} theme={theme} />
            </div>

            <div className="flex-grow flex items-center justify-between">
              <div>
                <h3 className={cn(
                  "font-display text-xl font-bold uppercase tracking-tight",
                  isCosmic ? "text-white" : "text-slate-950"
                )}>Elite Blade FF Non Root</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Environment Modifier • Secure Shell</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">LIVE</span>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {productSelected && !plansExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-center"
            >
              <motion.button
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPlansExpanded(true)}
                className={cn(
                  "px-12 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-2xl transition-all",
                  isCosmic 
                    ? "bg-cosmic-blue text-slate-950 hover:bg-cosmic-neon shadow-[0_0_20px_rgba(0,210,255,0.3)]" 
                    : "bg-slate-900 text-white hover:bg-slate-800"
                )}
              >
                DEPLOY PURCHASE
              </motion.button>
            </motion.div>
          )}

          {plansExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pt-4"
            >
              <div className="flex items-center justify-between px-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Available Licenses</span>
                <button 
                  onClick={() => setPlansExpanded(false)}
                  className="text-[10px] font-bold text-cosmic-blue uppercase hover:underline"
                >
                  Collapse
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PLANS.map((plan) => (
                  <motion.div
                    key={plan.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    className={cn(
                      "p-6 rounded-3xl border flex flex-col justify-between space-y-6",
                      isCosmic ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-xl"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{plan.duration}</div>
                        <div className={cn(
                          "font-display text-xl font-bold",
                          isCosmic ? "text-white" : "text-slate-900"
                        )}>{plan.name}</div>
                      </div>
                      <div className="text-xl font-display font-bold text-cosmic-blue">
                        ₹{plan.priceValue * quantities[plan.id]}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Quantity Selector */}
                      <div className={cn(
                        "flex items-center justify-between p-2 rounded-xl border",
                        isCosmic ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                      )}>
                        <span className="text-[10px] font-bold uppercase px-2 text-slate-500">Qty</span>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => updateQty(plan.id, -1)}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-mono font-bold w-4 text-center">{quantities[plan.id]}</span>
                          <button 
                            onClick={() => updateQty(plan.id, 1)}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuy(plan)}
                        className={cn(
                          "w-full py-4 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2",
                          isCosmic 
                            ? "bg-cosmic-blue text-slate-950 hover:bg-cosmic-neon" 
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        )}
                      >
                        <ShoppingCart size={16} />
                        SECURE KEY
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedPlan && (
        <PaymentModal 
          theme={theme} 
          plan={selectedPlan} 
          onClose={() => setSelectedPlan(null)} 
          user={user}
        />
      )}
    </div>
  );
}
