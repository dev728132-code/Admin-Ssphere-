import { Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { Users, Receipt, Clock, CheckCircle2, XCircle, ShieldCheck, Activity, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  createdAt: any;
  lastActive: any;
}

interface PaymentRequest {
  id: string;
  uid: string;
  userName: string;
  userEmail: string;
  productName: string;
  planName: string;
  amount: number;
  utr: string;
  status: 'pending' | 'verified' | 'rejected';
  timestamp: any;
}

export default function AdminView({ theme }: { theme: Theme }) {
  const isCosmic = theme === 'cosmic';
  const [users, setUsers] = useState<UserData[]>([]);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'payments' | 'users'>('payments');

  useEffect(() => {
    const qPayments = query(collection(db, 'payments'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribePayments = onSnapshot(qPayments, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentRequest));
      setPayments(p);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    const qUsers = query(collection(db, 'users'), orderBy('lastActive', 'desc'), limit(50));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const u = snapshot.docs.map(doc => doc.data() as UserData);
      setUsers(u);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => {
      unsubscribePayments();
      unsubscribeUsers();
    };
  }, []);

  const handleUpdateStatus = async (id: string, status: 'verified' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'payments', id), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `payments/${id}`);
    }
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-8 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className={cn(
            "font-display text-4xl font-bold uppercase tracking-tight",
            isCosmic ? "text-white" : "text-slate-900"
          )}>
            Admin <span className="text-cosmic-blue">Command</span>
          </h2>
          <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mt-2">
            System Overseer Terminal
          </p>
        </div>

        <div className={cn(
          "flex p-1 rounded-2xl border",
          isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <TabButton 
            active={activeTab === 'payments'} 
            onClick={() => setActiveTab('payments')} 
            label="Payments" 
            badge={pendingCount > 0 ? pendingCount : undefined}
            theme={theme}
          />
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
            label="Users" 
            theme={theme}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'payments' ? (
            <div className={cn(
              "rounded-3xl border overflow-hidden",
              isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xl"
            )}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={cn(
                      "border-b uppercase text-[10px] font-bold tracking-widest",
                      isCosmic ? "bg-slate-950/50 border-slate-800 text-slate-500" : "bg-slate-50 border-slate-100 text-slate-400"
                    )}>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">UTR/Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/20">
                    {payments.map((p) => (
                      <tr key={p.id} className={cn(
                        "transition-colors",
                        isCosmic ? "hover:bg-slate-800/30 text-slate-300" : "hover:bg-slate-50 text-slate-600"
                      )}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-xs uppercase">{p.userName}</div>
                          <div className="text-[10px] font-mono opacity-50">{p.userEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold uppercase">{p.productName}</div>
                          <div className="text-[10px] font-mono opacity-50">{p.planName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-mono font-bold text-cosmic-blue">₹{p.amount}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[10px] font-mono font-bold">{p.utr}</div>
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          {p.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleUpdateStatus(p.id, 'verified')}
                                className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 transition-colors hover:text-white"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(p.id, 'rejected')}
                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 transition-colors hover:text-white"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-500 font-bold uppercase text-xs tracking-widest">
                          No payment requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
             <div className={cn(
              "rounded-3xl border overflow-hidden",
              isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xl"
            )}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={cn(
                      "border-b uppercase text-[10px] font-bold tracking-widest",
                      isCosmic ? "bg-slate-950/50 border-slate-800 text-slate-500" : "bg-slate-50 border-slate-100 text-slate-400"
                    )}>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4">Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/20">
                    {users.map((u) => (
                      <tr key={u.uid} className={cn(
                        "transition-colors",
                        isCosmic ? "hover:bg-slate-800/30 text-slate-300" : "hover:bg-slate-50 text-slate-600"
                      )}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cosmic-blue/10 flex items-center justify-center text-cosmic-blue border border-cosmic-blue/20">
                              <ShieldCheck size={14} />
                            </div>
                            <div>
                              <div className="font-bold text-xs uppercase">{u.displayName}</div>
                              <div className="text-[10px] font-mono opacity-50">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {u.isAdmin ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cosmic-blue/20 text-cosmic-blue border border-cosmic-blue/30 uppercase">Admin</span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase">User</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[10px] font-mono uppercase">{u.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[10px] font-mono uppercase text-cosmic-blue">{u.lastActive?.toDate?.()?.toLocaleTimeString() || 'N/A'}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className={cn(
            "p-6 rounded-3xl border space-y-4",
            isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg"
          )}>
            <h3 className={cn("font-display font-bold uppercase tracking-tight flex items-center gap-2", isCosmic ? "text-white" : "text-slate-900")}>
              <Activity size={18} className="text-cosmic-blue" />
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
               <StatBox label="Total Users" value={users.length} theme={theme} />
               <StatBox label="Verifications" value={payments.filter(p => p.status === 'verified').length} theme={theme} />
            </div>
          </div>

          <div className={cn(
            "p-6 rounded-3xl border space-y-4",
            isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg"
          )}>
            <h3 className={cn("font-display font-bold uppercase tracking-tight flex items-center gap-2", isCosmic ? "text-white" : "text-slate-900")}>
              <Clock size={18} className="text-cosmic-blue" />
              Recent Actions
            </h3>
            <div className="space-y-3">
              {payments.filter(p => p.status !== 'pending').slice(0, 5).map(p => (
                <div key={p.id} className={cn("p-3 rounded-xl border flex items-center gap-3", isCosmic ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-100")}>
                  {p.status === 'verified' ? <CheckCircle2 className="text-green-500" size={14} /> : <XCircle className="text-red-500" size={14} />}
                  <div className="flex-grow min-w-0">
                    <div className="text-[10px] font-bold uppercase truncate">{p.userName}</div>
                    <div className="text-[9px] text-slate-500 uppercase">{p.status === 'verified' ? 'Approved' : 'Rejected'} ₹{p.amount}</div>
                  </div>
                </div>
              ))}
              {payments.filter(p => p.status !== 'pending').length === 0 && (
                <div className="text-[10px] text-slate-500 text-center py-4 uppercase font-bold tracking-widest">No recent actions</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, badge, theme }: { active: boolean, onClick: () => void, label: string, badge?: number, theme: Theme }) {
  const isCosmic = theme === 'cosmic';
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all",
        active 
          ? (isCosmic ? "bg-cosmic-blue text-slate-950" : "bg-slate-900 text-white shadow-lg")
          : (isCosmic ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900")
      )}
    >
      {label}
      {badge !== undefined && (
        <span className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
          active ? "bg-slate-950/20 text-slate-950" : "bg-cosmic-blue text-slate-950"
        )}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: 'pending' | 'verified' | 'rejected' }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    verified: "bg-green-500/10 text-green-500 border-green-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20"
  };
  return (
    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase mt-1 inline-block", styles[status])}>
      {status}
    </span>
  );
}

function StatBox({ label, value, theme }: { label: string, value: number, theme: Theme }) {
  const isCosmic = theme === 'cosmic';
  return (
    <div className={cn(
      "p-4 rounded-2xl border",
      isCosmic ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-100"
    )}>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
      <div className={cn("text-2xl font-display font-bold", isCosmic ? "text-white" : "text-slate-900")}>{value}</div>
    </div>
  );
}
