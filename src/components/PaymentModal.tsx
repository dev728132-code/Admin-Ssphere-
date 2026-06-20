import { Theme, SubscriptionPlan } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { X, Copy, Check, ExternalLink, QrCode, Phone, User as UserIcon, MessageSquare, Landmark, Upload } from 'lucide-react';
import { useState, ReactNode } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Logo from './Logo';

import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useEffect } from 'react';

interface PaymentModalProps {
  theme: Theme;
  plan: SubscriptionPlan;
  onClose: () => void;
  user: any;
}

export default function PaymentModal({ theme, plan, onClose, user }: PaymentModalProps) {
  const isCosmic = theme === 'cosmic';
  const upiId = "toufikshaike200@okaxis";
  const payeeName = "Rehana";
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&mc=0000&mode=02&purpose=00&am=${plan.price.replace('₹', '').replace(',', '')}`;
  
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<any>(null);
  const [form, setForm] = useState({
    name: user?.firebase?.displayName || '',
    phone: '',
    whatsapp: '',
    utr: '',
  });

  useEffect(() => {
    if (!user?.firebase?.uid || !plan) return;

    const q = query(
      collection(db, 'payments'),
      where('uid', '==', user.firebase.uid),
      where('planId', '==', plan.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // Find the latest pending payment manually by sorting client-side
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))
                                 .sort((a, b) => (b.timestamp?.toMillis() || Date.now()) - (a.timestamp?.toMillis() || Date.now()));
        const latest = docs[0];
        if (latest.status === 'pending') {
          setPendingPayment(latest);
        } else {
          setPendingPayment(null);
        }
      } else {
        setPendingPayment(null);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'payments'));

    return () => unsubscribe();
  }, [user, plan]);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!form.name || !form.phone || !form.whatsapp || !form.utr) {
      alert("Please fill in all details for verification.");
      return;
    }

    if (!user?.firebase) {
      alert("Please sign in to proceed with payment verification.");
      return;
    }

    setIsVerifying(true);

    try {
      await addDoc(collection(db, 'payments'), {
        uid: user.firebase.uid,
        userName: form.name,
        userEmail: user.firebase.email,
        productId: 'elite-blade-ff',
        productName: 'Elite Blade FF Non Root',
        planId: plan.id,
        planName: plan.name,
        amount: parseInt(plan.price.replace('₹', '').replace(',', '')),
        utr: form.utr,
        status: 'pending',
        timestamp: serverTimestamp()
      });

      const message = `*New Purchase Request*
*Product:* Elite Blade FF Non Root
*Plan:* ${plan.name}
*Amount:* ${plan.price}
*Customer Name:* ${form.name}
*Phone:* ${form.phone}
*WhatsApp:* ${form.whatsapp}
*UTR:* ${form.utr}`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/9470851455?text=${encodedMessage}`, '_blank');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'payments');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
          "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-3xl border shadow-2xl",
          isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-cosmic-blue/10 text-cosmic-blue border border-cosmic-blue/20">
              <Logo size={24} theme={theme} />
            </div>
            <div>
              <h3 className={cn(
                "font-display font-bold uppercase tracking-tight text-lg",
                isCosmic ? "text-white" : "text-slate-900"
              )}>Purchase <span className="text-cosmic-blue">Key</span></h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest">{plan.name} Armory Key</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-500/10 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: QR and UPI */}
          <div className="space-y-6">
            <div className={cn(
              "p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 border",
              isCosmic ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100"
            )}>
              <div className="p-4 bg-white rounded-xl shadow-lg">
                <QRCodeSVG 
                  value={upiLink} 
                  size={180} 
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-cosmic-blue">{plan.price}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Scan with any UPI App</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>Payee Name</span>
                <span className="text-cosmic-blue">{payeeName}</span>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">UPI ID</label>
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-xl border",
                  isCosmic ? "bg-slate-800/50 border-slate-700" : "bg-slate-100 border-slate-200"
                )}>
                  <span className="font-mono text-sm">{upiId}</span>
                  <button 
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-cosmic-blue/10 text-cosmic-blue transition-colors"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <motion.a
               href={upiLink}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className={cn(
                "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all",
                isCosmic 
                  ? "bg-cosmic-blue text-slate-950 hover:bg-cosmic-neon" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
               )}
            >
              PAY WITH UPI APP <ExternalLink size={18} />
            </motion.a>
          </div>

          {/* Right: Verification Form */}
          <div className="space-y-6">
            <h4 className={cn(
              "text-sm font-bold uppercase tracking-widest flex items-center gap-2",
              isCosmic ? "text-slate-300" : "text-slate-700"
            )}>
              <Upload size={16} className="text-cosmic-blue" />
              Verification Details
            </h4>

            <div className="space-y-4">
              <InputGroup 
                label="Customer Name" 
                icon={<UserIcon size={16} />} 
                value={form.name} 
                onChange={(v) => setForm({...form, name: v})} 
                placeholder="Enter your full name"
                theme={theme}
              />
              <InputGroup 
                label="Phone Number" 
                icon={<Phone size={16} />} 
                value={form.phone} 
                onChange={(v) => setForm({...form, phone: v})} 
                placeholder="Primary contact number"
                theme={theme}
              />
              <InputGroup 
                label="WhatsApp Number" 
                icon={<MessageSquare size={16} />} 
                value={form.whatsapp} 
                onChange={(v) => setForm({...form, whatsapp: v})} 
                placeholder="For key delivery"
                theme={theme}
              />
              <InputGroup 
                label="UTR / Transaction ID" 
                icon={<Landmark size={16} />} 
                value={form.utr} 
                onChange={(v) => setForm({...form, utr: v})} 
                placeholder="12-digit transaction number"
                theme={theme}
              />
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Screenshot Upload</label>
                <div className={cn(
                  "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-cosmic-blue/50 transition-colors",
                  isCosmic ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                )}>
                  <Upload size={24} className="mx-auto text-slate-500 mb-2" />
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Select Payment Screenshot</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying || !!pendingPayment}
              className={cn(
                "w-full py-4 rounded-2xl font-bold uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2",
                pendingPayment 
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : (isCosmic ? "bg-green-600 text-white hover:bg-green-500" : "bg-green-600 text-white hover:bg-green-700")
              )}
            >
              {isVerifying ? "Processing..." : pendingPayment ? "Pending Verification" : "Verify Payment"}
            </button>
          </div>
        </div>

        <div className={cn(
          "mt-8 p-4 rounded-xl",
          isCosmic ? "bg-blue-500/10" : "bg-blue-50"
        )}>
          {pendingPayment ? (
            <p className="text-[10px] text-center text-amber-500 leading-relaxed uppercase font-bold tracking-tighter">
              A verification request is already pending for this plan. Please wait for our team to approve it.
            </p>
          ) : (
            <p className="text-[10px] text-center text-slate-500 leading-relaxed uppercase font-bold tracking-tighter">
              Note: After verification, our team will dispatch your Elite Key via WhatsApp. 
              Typical processing time is less than 12 minutes.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function InputGroup({ label, icon, value, onChange, placeholder, theme }: { 
  label: string, 
  icon: ReactNode, 
  value: string, 
  onChange: (v: string) => void, 
  placeholder: string,
  theme: Theme 
}) {
  const isCosmic = theme === 'cosmic';
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
        isCosmic ? "bg-slate-800/50 border-slate-700 focus-within:border-cosmic-blue/50" : "bg-slate-100 border-slate-200 focus-within:border-slate-400 font-medium"
      )}>
        <div className="text-slate-500">{icon}</div>
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none w-full text-sm placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}
