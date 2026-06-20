import { Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Globe, Lock, Info, CheckCircle2, Cpu } from 'lucide-react';
import { ReactNode } from 'react';
import Logo from './Logo';

export default function HomeView({ theme }: { theme: Theme, user: any, onLogin: () => void }) {
  const isCosmic = theme === 'cosmic';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-24 pb-20"
    >
      {/* Hero Section */}
      <motion.section variants={item} className="text-center py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest",
            isCosmic ? "bg-cosmic-blue/10 text-cosmic-blue border border-cosmic-blue/20" : "bg-slate-100 text-slate-600 border border-slate-200"
          )}
        >
          <Cpu size={14} className="text-cosmic-blue animate-pulse" />
          Neural-AI Core Link Established
        </motion.div>
        
        <h1 className={cn(
          "font-display text-5xl md:text-8xl font-bold tracking-tighter uppercase leading-tight",
          isCosmic ? "text-white" : "text-slate-950"
        )}>
          Advanced <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-blue via-cosmic-neon to-cosmic-indigo">Tactical Supremacy</span>
        </h1>
        
        <p className={cn(
          "text-xl max-w-3xl mx-auto leading-relaxed",
          isCosmic ? "text-slate-400" : "text-slate-600"
        )}>
          NOVAFF ELITE provides high-end environmental enhancements for competitive gamers. 
          Experience the pinnacle of kernel-level stability and absolute security.
        </p>

        <div className="flex flex-wrap justify-center gap-6 pt-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500">
            <Lock size={16} className="text-cosmic-blue" />
            100% Secure
          </div>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500">
            <ShieldCheck size={16} className="text-cosmic-blue" />
            Undetected
          </div>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500">
            <Globe size={16} className="text-cosmic-blue" />
            Global Nodes
          </div>
        </div>
      </motion.section>

      {/* Website Introduction */}
      <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className={cn(
            "inline-block px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em]",
            isCosmic ? "bg-cosmic-blue/10 text-cosmic-blue" : "bg-slate-100 text-slate-600"
          )}>
            New Paradigm Shift
          </div>
          <h2 className={cn(
            "font-display text-5xl md:text-6xl font-bold uppercase tracking-tight leading-none",
            isCosmic ? "text-white" : "text-slate-900"
          )}>
            The Absolute <br /><span className="text-cosmic-blue">Command Center</span>
          </h2>
          <p className={cn(
            "text-lg leading-relaxed opacity-80",
            isCosmic ? "text-slate-300" : "text-slate-600"
          )}>
            NovaFF Elite is the ultimate environmental modifier for those who demand total control. 
            Our architecture is built on absolute discretion and peak technical performance, 
            allowing you to focus strictly on your objective while we handle the persistence.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Stealth Injection', 'Low-Lat Cluster', 'Dynamic Config', 'Elite Overdrive'].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-cosmic-blue" />
                <span className="font-bold uppercase tracking-wider text-[11px]">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(
          "aspect-square lg:aspect-[4/3] rounded-[3rem] overflow-hidden border relative group",
          isCosmic ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200 shadow-2xl"
        )}>
          <img 
            src="/src/assets/images/tactical_command_hero_1781931974269.jpg" 
            alt="NovaFF Elite Command Terminal" 
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-8 left-8 flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-cosmic-blue/20 backdrop-blur-md flex items-center justify-center border border-cosmic-blue/30">
               <Logo size={24} theme={theme} />
             </div>
             <div>
               <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Neural Link</div>
               <div className="text-xs font-bold text-white uppercase tracking-wider">Nova AI Core v12.0</div>
             </div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Elite Blade */}
      <motion.section variants={item} className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className={cn(
            "font-display text-4xl font-bold uppercase tracking-tight",
            isCosmic ? "text-white" : "text-slate-900"
          )}>Why Choose <span className="text-cosmic-blue">Elite Blade</span></h2>
          <p className="text-slate-500 max-w-xl mx-auto">Engineered for those who refuse to settle for anything less than perfection.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<ShieldCheck size={32} />} 
            title="Sovereign Security" 
            desc="Our proprietary encryption layers ensure your identity remains protected across all network protocols."
            theme={theme}
          />
          <FeatureCard 
            icon={<Zap size={32} />} 
            title="Instant Deployment" 
            desc="One-click activation through our cloud-sync interface. No complex setup or manual injection required."
            theme={theme}
          />
          <FeatureCard 
            icon={<Globe size={32} />} 
            title="Regional Optimization" 
            desc="Global HK and SG relay nodes ensure ultra-low latency regardless of your physical location."
            theme={theme}
          />
        </div>
      </motion.section>

      {/* Information Section */}
      <motion.section variants={item} className={cn(
        "p-12 rounded-[2.5rem] border overflow-hidden relative",
        isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-2xl"
      )}>
        {isCosmic && <div className="absolute top-0 right-0 w-64 h-64 bg-cosmic-blue/5 blur-[100px]" />}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h3 className={cn(
              "font-display text-2xl font-bold uppercase tracking-tight",
              isCosmic ? "text-white" : "text-slate-900"
            )}>Elite Protocol Infrastructure</h3>
            <p className={cn(
              "text-lg",
              isCosmic ? "text-slate-400" : "text-slate-600"
            )}>
              Our back-end infrastructure is built on high-availability clusters distributed 
              geographically. This ensures that even during peak load, your environmental 
              enhancements maintain consistent performance with zero packet loss.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Uptime', val: '99.9%' },
                { label: 'Latency', val: '< 30ms' },
                { label: 'Security', val: 'AES-256' },
                { label: 'Support', val: '24/7' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-xl font-display font-bold text-cosmic-blue">{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h3 className={cn(
               "font-display text-2xl font-bold uppercase tracking-tight",
               isCosmic ? "text-white" : "text-slate-900"
            )}>Status Center</h3>
            <div className="space-y-3">
              <StatusRow label="System Core" status="Operational" theme={theme} />
              <StatusRow label="Relay Nodes" status="Stable" theme={theme} />
              <StatusRow label="Encryption" status="Optimal" theme={theme} />
              <StatusRow label="Marketplace" status="Online" theme={theme} />
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, theme }: { icon: ReactNode, title: string, desc: string, theme: Theme }) {
  const isCosmic = theme === 'cosmic';
  return (
    <div className={cn(
      "p-8 rounded-3xl border space-y-4 hover:border-cosmic-blue/50 transition-all group",
      isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg"
    )}>
      <div className="text-cosmic-blue group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className={cn(
        "font-display text-xl font-bold uppercase tracking-tight",
        isCosmic ? "text-white" : "text-slate-900"
      )}>{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatusRow({ label, status, theme }: { label: string, status: string, theme: Theme }) {
  const isCosmic = theme === 'cosmic';
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-xl border text-xs font-bold uppercase tracking-widest",
      isCosmic ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100"
    )}>
      <span className="text-slate-500">{label}</span>
      <span className="flex items-center gap-2 text-cosmic-blue">
        <div className="w-1.5 h-1.5 rounded-full bg-cosmic-blue animate-pulse" />
        {status}
      </span>
    </div>
  );
}
