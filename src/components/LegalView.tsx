import { Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { Shield, FileText, Send, Mail, MapPin, Phone } from 'lucide-react';
import { ReactNode } from 'react';

export default function LegalView({ theme, type }: { theme: Theme, type: 'privacy' | 'terms' | 'contact' }) {
  const isCosmic = theme === 'cosmic';

  return (
    <div className="space-y-12 pb-20">
      <section className="text-center space-y-4">
        <h2 className={cn(
          "font-display text-4xl font-bold uppercase tracking-tight",
          isCosmic ? "text-white" : "text-slate-900"
        )}>
          {type === 'privacy' && <span>Privacy <span className="text-cosmic-blue">Protocol</span></span>}
          {type === 'terms' && <span>Terms of <span className="text-cosmic-blue">Engagement</span></span>}
          {type === 'contact' && <span>Secure <span className="text-cosmic-blue">Nexus</span></span>}
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto uppercase text-xs font-bold tracking-widest leading-relaxed">
          {type === 'privacy' && "How we handle and encrypt your environmental session metadata."}
          {type === 'terms' && "The legal framework governing your access to the Elite Armory."}
          {type === 'contact' && "Direct communication channels for institutional and elite inquiries."}
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-12 rounded-[2.5rem] border relative overflow-hidden",
          isCosmic ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-2xl"
        )}
      >
        {isCosmic && <div className="absolute top-0 left-0 w-64 h-64 bg-cosmic-blue/5 blur-[100px]" />}
        <div className="relative z-10 prose prose-slate max-w-none prose-sm md:prose-base dark:prose-invert">
          {type === 'privacy' && (
            <div className="space-y-8">
              <Section icon={<Shield />} title="Data Collection Principles">
                <p>We do not collect personal identifiable information (PII). Our systems only process hardware tokens (HWID) and system-level metadata required for environment optimization. This data is transient and encrypted using AES-256 protocols.</p>
              </Section>
              <Section icon={<FileText />} title="Cookies & Trackers">
                <p>NOVAFF ELITE does not utilize third-party trackers or marketing cookies. We use essential session tokens to maintain your authentication state within the terminal.</p>
              </Section>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-8">
              <Section icon={<FileText />} title="License Agreement">
                <p>All procurement of Elite Protocols constitutes a non-transferable, single-user license. Any attempts to redistribute, reverse-engineer, or share hardware tokens will result in immediate HWID blacklisting without refund.</p>
              </Section>
              <Section icon={<Shield />} title="Responsibility">
                <p>The user assumes all risks associated with the deployment of environmental enhancements. NOVAFF ELITE is not responsible for platform-specific sanctions or account termination resulting from misuse of provided tools.</p>
              </Section>
            </div>
          )}

          {type === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cosmic-blue/10 flex items-center justify-center text-cosmic-blue">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Support</div>
                    <div className={cn("font-bold text-lg", isCosmic ? "text-white" : "text-slate-900")}>elite@novaff.io</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cosmic-blue/10 flex items-center justify-center text-cosmic-blue">
                    <Send size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Telegram</div>
                    <div className={cn("font-bold text-lg", isCosmic ? "text-white" : "text-slate-900")}>@AnshuElite</div>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cosmic-blue/10 flex items-center justify-center text-cosmic-blue">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Headquarters</div>
                    <div className={cn("font-bold text-lg", isCosmic ? "text-white" : "text-slate-900")}>Singapore Digital District</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cosmic-blue/10 flex items-center justify-center text-cosmic-blue">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Corporate Line</div>
                    <div className={cn("font-bold text-lg", isCosmic ? "text-white" : "text-slate-900")}>+65 8000 1200</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: ReactNode, title: string, children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-cosmic-blue">
        {icon}
        <h3 className="font-display font-bold uppercase tracking-tight text-xl m-0">{title}</h3>
      </div>
      <div className="text-slate-500 leading-relaxed font-bold tracking-tighter uppercase text-xs">
        {children}
      </div>
    </div>
  );
}
