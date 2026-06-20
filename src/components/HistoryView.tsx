import { Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Calendar, Hash, Tag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/src/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface Order {
  id: string;
  productName: string;
  planName: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected' | string;
  verificationStatus: string;
  userName: string;
  userEmail: string;
}

export default function HistoryView({ theme, user }: { theme: Theme, user: any }) {
  const isCosmic = theme === 'cosmic';
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user?.firebase?.uid) {
      return;
    }

    const q = query(
      collection(db, 'payments'),
      where('uid', '==', user.firebase.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ps = snapshot.docs.map(doc => {
        const data = doc.data();
        let displayStatus = data.status || 'pending';
        let verifyStatus = 'Payment pending';
        
        if (displayStatus === 'approved' || displayStatus === 'verified') {
          displayStatus = 'accepted';
          verifyStatus = 'Verified';
        } else if (displayStatus === 'rejected') {
          verifyStatus = 'Verification Failed';
        }

        return {
          id: doc.id,
          productName: data.productName || 'Elite Blade FF Non Root',
          planName: data.planName || 'Unknown Plan',
          date: data.timestamp?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
          status: displayStatus,
          verificationStatus: verifyStatus,
          userName: data.userName || user.firebase.displayName || 'Unknown',
          userEmail: data.userEmail || user.firebase.email || 'Unknown',
          _timestamp: data.timestamp?.toMillis() || Date.now()
        };
      }).sort((a, b) => b._timestamp - a._timestamp);
      setOrders(ps);
    }, (error) => {
      console.error(error);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return <CheckCircle2 className="text-green-500" size={16} />;
      case 'rejected': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-amber-500" size={16} />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return isCosmic ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-green-50 text-green-600 border-green-100";
      case 'rejected': return isCosmic ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-red-50 text-red-600 border-red-100";
      default: return isCosmic ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className={cn(
          "font-display text-3xl font-bold uppercase tracking-tight",
          isCosmic ? "text-white" : "text-slate-900"
        )}>
          Payment <span className="text-cosmic-blue">History</span>
        </h2>
        <p className={cn(
          "text-sm uppercase tracking-[0.2em] font-bold opacity-60",
          isCosmic ? "text-slate-400" : "text-slate-500"
        )}>
          Complete Transaction Archives
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.length === 0 ? (
          <div className={cn(
            "p-12 rounded-[2.5rem] border border-dashed text-center flex flex-col items-center gap-4",
            isCosmic ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
          )}>
            <div className="p-4 rounded-full bg-slate-800/50 text-slate-500">
              <Hash size={32} />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">No transaction</p>
          </div>
        ) : (
          orders.map((order, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={order.id}
              className={cn(
                "p-6 rounded-3xl border transition-all hover:scale-[1.01]",
                isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-md"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left Side: Order Info */}
                <div className="flex items-start gap-5">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border",
                    isCosmic ? "bg-slate-800 border-slate-700 text-cosmic-blue" : "bg-slate-50 border-slate-100 text-slate-400"
                  )}>
                    <Hash size={24} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className={cn(
                        "font-display font-bold uppercase tracking-tight",
                        isCosmic ? "text-white" : "text-slate-950"
                      )}>{order.productName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <Tag size={10} />
                       {order.planName}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-1">
                       <Calendar size={10} />
                       Purchased: {order.date} | ID: {order.id.slice(0,8).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-0.5">
                       <User size={10} />
                       Buyer: <span className={isCosmic ? "text-slate-300" : "text-slate-700"}>{order.userName} ({order.userEmail})</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Statuses */}
                <div className="flex flex-col sm:flex-row md:items-end gap-3 sm:gap-6">
                  <div className="space-y-2">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 md:text-right">Status</div>
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase",
                      getStatusBadgeClass(order.status)
                    )}>
                      {getStatusIcon(order.status)}
                      {order.verificationStatus}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
