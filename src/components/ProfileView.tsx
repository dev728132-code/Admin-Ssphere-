import { User as FirebaseUser } from 'firebase/auth';
import { Theme, UserActivity, View } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { Sword, ShieldCheck, Activity, Globe, Wifi, Server, LogOut, Clock, Settings, LayoutDashboard, Receipt } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { format } from 'date-fns';

export default function ProfileView({ theme, user, onLogout, onViewChange }: { theme: Theme, user: any, onLogout: () => void, onViewChange: (view: View) => void }) {
  const isCosmic = theme === 'cosmic';
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.firebase) return;

    const qActs = query(
      collection(db, 'activities'),
      where('uid', '==', user.firebase.uid)
    );

    const unsubscribeActs = onSnapshot(qActs, (snapshot) => {
      const acts: UserActivity[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        acts.push({
          id: doc.id,
          action: data.action,
          timestamp: data.timestamp?.toDate() || new Date(),
          details: data.details,
          _ts: data.timestamp?.toMillis() || Date.now()
        } as any);
      });
      setActivities(acts.sort((a: any, b: any) => b._ts - a._ts).slice(0, 10));
    });

    const qPayments = query(
      collection(db, 'payments'),
      where('uid', '==', user.firebase.uid)
    );

    const unsubscribePayments = onSnapshot(qPayments, (snapshot) => {
      const ps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))
                              .sort((a, b) => (b.timestamp?.toMillis() || Date.now()) - (a.timestamp?.toMillis() || Date.now()))
                              .slice(0, 10);
      setPayments(ps);
    });

    return () => {
      unsubscribeActs();
      unsubscribePayments();
    };
  }, [user]);

  if (!user?.firebase) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header card */}
      <motion.div 
        variants={item}
        className={cn(
        "p-12 rounded-3xl border flex flex-col items-center gap-8 relative overflow-hidden",
        isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
      )}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cosmic-blue/5 blur-3xl" />
        
        <div className="flex flex-col items-center space-y-6 relative z-10">
          <div className="relative">
            <div className={cn(
              "w-32 h-32 rounded-[2.5rem] overflow-hidden border-4",
              isCosmic ? "border-cosmic-blue/40" : "border-slate-900"
            )}>
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 bg-cosmic-blue p-3 rounded-full text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.4)]"
            >
              <Sword size={24} strokeWidth={2.5} />
            </motion.div>
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col items-center gap-3">
              <h2 className={cn(
                "font-display text-4xl font-bold uppercase tracking-tight",
                isCosmic ? "text-white" : "text-slate-950"
              )}>{user.firebase.displayName || 'Elite Operative'}</h2>
              <div className="flex gap-2">
                 <span className="px-4 py-1.5 rounded-full bg-cosmic-blue/10 text-cosmic-blue text-xs font-bold uppercase tracking-widest border border-cosmic-blue/20 shadow-sm">Elite Member</span>
                 <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-widest border border-green-500/20 flex items-center gap-1 shadow-sm">
                   <ShieldCheck size={12} /> Verified
                 </span>
                 {user.isAdmin && (
                   <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest border border-amber-500/20 shadow-sm">Admin</span>
                 )}
              </div>
            </div>
            <p className="text-slate-500 font-mono text-sm tracking-wider">{user.firebase.email}</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {user.isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('admin')}
                className={cn(
                  "px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2",
                  isCosmic ? "bg-cosmic-blue text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.3)]" : "bg-slate-900 text-white"
                )}
              >
                <LayoutDashboard size={18} />
                ADMIN PANEL
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className={cn(
                "px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2",
                isCosmic ? "bg-slate-800 text-slate-300 hover:text-white border border-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              )}
            >
              <LogOut size={18} />
              TERMINATE SESSION
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Telemetry STATS */}
        <motion.div variants={item} className="md:col-span-2 space-y-6">
          <div className={cn(
            "p-6 rounded-3xl border grid grid-cols-2 md:grid-cols-4 gap-6",
            isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          )}>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Wifi size={10} /> Latency
              </span>
              <div className="text-xl font-mono font-bold text-cosmic-blue">24ms</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Globe size={10} /> Node
              </span>
              <div className="text-xl font-mono font-bold text-cosmic-blue">Global HK</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={10} /> Encryption
              </span>
              <div className="text-xl font-mono font-bold text-cosmic-blue">AES-256</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Server size={10} /> Protocol
              </span>
              <div className="text-xl font-mono font-bold text-cosmic-blue">FF-Core V3</div>
            </div>
          </div>

          <motion.div 
            variants={item}
            className={cn(
            "p-8 rounded-3xl border space-y-6",
            isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          )}>
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "font-display font-bold uppercase tracking-tight flex items-center gap-2",
                isCosmic ? "text-white" : "text-slate-900"
              )}>
                <Activity size={18} className="text-cosmic-blue" />
                Black Box Logs
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chronological View</span>
            </div>

            <div className="space-y-2">
              {activities.length > 0 ? (
                activities.map((act) => (
                  <motion.div 
                    variants={item}
                    key={act.id} 
                    className={cn(
                      "p-4 rounded-xl border flex items-center justify-between group transition-all",
                      isCosmic ? "bg-slate-950 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-cosmic-blue" />
                      <div>
                        <div className="text-sm font-bold uppercase tracking-tight">{act.action}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{act.details}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      <Clock size={10} />
                      {format(act.timestamp, 'HH:mm:ss')}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm italic">
                  No operational records found. Initiate a procedure to generate logs.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Sidebar / Badge */}
        <motion.div variants={item} className="space-y-6">
          <div className={cn(
            "p-8 rounded-3xl border space-y-6",
            isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg"
          )}>
            <h3 className={cn(
               "font-display font-bold uppercase tracking-tight flex items-center gap-2",
               isCosmic ? "text-white" : "text-slate-900"
            )}>
              <Settings size={18} className="text-cosmic-blue" />
              Settings
            </h3>
            <div className="space-y-2">
              <SettingToggle label="Stealth Mode" active={true} theme={theme} />
              <SettingToggle label="Cloud Sync" active={true} theme={theme} />
              <SettingToggle label="HWID Mask" active={false} theme={theme} />
            </div>
          </div>

          <div className={cn(
            "p-8 rounded-3xl border flex flex-col items-center text-center space-y-4 overflow-hidden relative group",
            isCosmic ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800" : "bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-xl"
          )}>
            <div className="absolute inset-0 bg-cosmic-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 w-20 h-20 rounded-full bg-cosmic-blue/10 flex items-center justify-center text-cosmic-blue">
              <Sword size={32} />
            </div>
            <div className="relative z-10">
              <h4 className={cn(
                "font-display font-bold uppercase tracking-widest text-lg",
                isCosmic ? "text-white" : "text-slate-900"
              )}>Elite Class Alpha</h4>
              <p className="text-xs text-slate-500 mt-2">Maximum priority deployment permissions.</p>
            </div>
          </div>
          
           <div className={cn(
            "p-6 rounded-3xl border text-center space-y-4",
            isCosmic ? "bg-slate-900/50 border-slate-800" : "bg-slate-100 border-slate-200"
          )}>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Digital Security Token</div>
            <div className="p-3 bg-slate-950/50 rounded-xl font-mono text-[10px] break-all text-cosmic-blue border border-cosmic-blue/20">
              NVF-ELT-{user.firebase.uid.slice(0, 16).toUpperCase()}-SEC-V3
            </div>
          </div>

          <motion.div 
            variants={item}
            className={cn(
            "p-8 rounded-3xl border space-y-6",
            isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          )}>
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "font-display font-bold uppercase tracking-tight flex items-center gap-2",
                isCosmic ? "text-white" : "text-slate-900"
              )}>
                <Receipt size={18} className="text-cosmic-blue" />
                Payment History
              </h3>
            </div>

            <div className="space-y-3">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <div 
                    key={p.id} 
                    className={cn(
                      "p-4 rounded-xl border flex items-center justify-between transition-all",
                      isCosmic ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100 font-medium"
                    )}
                  >
                    <div>
                      <div className="text-xs font-bold uppercase">{p.planName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-slate-500">₹{p.amount}</span>
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-slate-500 font-mono">{p.timestamp?.toDate().toLocaleDateString()}</div>
                      <div className="text-[9px] font-mono text-slate-400 mt-1 uppercase">{p.utr.slice(0, 8)}...</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-[10px] uppercase font-bold tracking-widest italic">
                  No purchase history found
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: 'pending' | 'verified' | 'rejected' }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    verified: "bg-green-500/10 text-green-500 border-green-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20"
  };
  return (
    <span className={cn("text-[8px] font-bold px-2 py-0.5 rounded-full border uppercase inline-block", styles[status])}>
      {status}
    </span>
  );
}

function SettingToggle({ label, active, theme }: { label: string, active: boolean, theme: Theme }) {
  const isCosmic = theme === 'cosmic';
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-xl border",
      isCosmic ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100"
    )}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <div className={cn(
        "w-10 h-5 rounded-full relative transition-colors",
        active ? "bg-cosmic-blue" : "bg-slate-800"
      )}>
        <div className={cn(
          "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
          active ? "right-1" : "left-1"
        )} />
      </div>
    </div>
  );
}
