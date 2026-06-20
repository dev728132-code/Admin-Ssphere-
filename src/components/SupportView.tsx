import { Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { ShieldAlert, MessageCircle, Send, Copy, Check, Clock, Network, Activity } from 'lucide-react';
import { useState, ReactNode } from 'react';

export default function SupportView({ theme }: { theme: Theme }) {
  const isCosmic = theme === 'cosmic';
  const securityToken = "ELT-X92-PROC-HK-0021";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(securityToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Support Channels */}
        <div className="lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <h2 className={cn(
              "font-display text-4xl font-bold uppercase tracking-tight",
              isCosmic ? "text-white" : "text-slate-900"
            )}>Support <span className="text-cosmic-blue">Nexus</span></h2>
            <p className="text-slate-500">Encrypted communication channels for immediate elite assistance.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <motion.a 
              href="https://wa.me/9470851455"
              target="_blank"
              rel="noreferrer"
              whileHover={{ x: 10 }}
              className={cn(
                "p-8 rounded-3xl border flex items-center justify-between group h-full",
                isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg"
              )}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shadow-inner">
                  <MessageCircle size={32} />
                </div>
                <div>
                  <div className={cn(
                    "font-display font-bold uppercase tracking-wide",
                    isCosmic ? "text-white" : "text-slate-900"
                  )}>WhatsApp Support</div>
                  <div className="text-xs text-slate-500 font-bold uppercase mt-1">2/7 Immediate Response</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Active
              </div>
            </motion.a>

            <div className={cn(
              "p-8 rounded-3xl border grid grid-cols-1 md:grid-cols-2 gap-8",
              isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg"
            )}>
              <HelpItem 
                icon={<ShieldAlert size={20} />} 
                title="Payment Issues" 
                desc="Urgently report failed transfers or verification delays." 
                theme={theme}
              />
              <HelpItem 
                icon={<Clock size={20} />} 
                title="Key Not Received" 
                desc="If verification is complete but key is pending > 30mins." 
                theme={theme}
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="lg:w-1/2 space-y-8">
          <h3 className={cn(
            "font-display text-2xl font-bold uppercase tracking-tight flex items-center gap-3",
            isCosmic ? "text-white" : "text-slate-900"
          )}>
            <div className="w-8 h-1 bg-cosmic-blue rounded-full" />
            Operational Intel (FAQ)
          </h3>
          
          <div className="space-y-4">
            <AccordionItem 
              title="Is it safe for competitive play?" 
              content="Yes. Elite Blade operates at kernel Level 0, ensuring absolute invisibility from traditional user-mode anti-cheat systems."
              theme={theme}
            />
            <AccordionItem 
              title="How do I activate my key?" 
              content="Once received via WhatsApp/Telegram, simply copy the code and inject it via the provided Elite Launcher Interface."
              theme={theme}
            />
            <AccordionItem 
              title="Do you offer refunds?" 
              content="Due to the nature of digital license keys, all sales are final. Please ensure compatibility with your environment before procurement."
              theme={theme}
            />
          </div>

          <div className={cn(
            "p-6 rounded-3xl border space-y-4",
            isCosmic ? "bg-cosmic-blue/5 border-cosmic-blue/20" : "bg-slate-50 border-slate-200"
          )}>
             <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cosmic-blue text-slate-950">
                <ShieldAlert size={18} />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-wide">Elite Security Protocol</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Never share your license key or hardware token. External distribution triggers immediate account blacklisting and HWID termination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpItem({ icon, title, desc, theme }: { icon: ReactNode, title: string, desc: string, theme: Theme }) {
  const isCosmic = theme === 'cosmic';
  return (
    <div className="space-y-2">
      <div className="text-cosmic-blue">{icon}</div>
      <h4 className={cn(
        "font-bold uppercase tracking-wide text-xs",
        isCosmic ? "text-white" : "text-slate-900"
      )}>{title}</h4>
      <p className="text-[10px] text-slate-500 leading-relaxed font-bold tracking-tighter uppercase">{desc}</p>
    </div>
  );
}

function AccordionItem({ title, content, theme }: { title: string, content: string, theme: Theme }) {
  const isCosmic = theme === 'cosmic';
  return (
    <div className={cn(
      "p-6 rounded-2xl border transition-all",
      isCosmic ? "bg-slate-950 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-100 hover:border-slate-200"
    )}>
      <h4 className={cn(
        "font-bold text-sm uppercase tracking-wide mb-2",
        isCosmic ? "text-slate-200" : "text-slate-800"
      )}>{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{content}</p>
    </div>
  );
}
