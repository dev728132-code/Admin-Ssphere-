import { Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { Globe, ShieldCheck, Mail } from 'lucide-react';
import Logo from './Logo';

export default function Footer({ theme, onViewChange }: { theme: Theme, onViewChange: (view: any) => void }) {
  const isCosmic = theme === 'cosmic';

  return (
    <footer className={cn(
      "mt-auto py-12 border-t",
      isCosmic ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"
    )}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Logo size={20} theme={theme} />
            <span className={cn(
              "font-display font-bold uppercase",
              isCosmic ? "text-white" : "text-slate-900"
            )}>
              NOVAFF <span className="text-cosmic-blue">ELITE</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            The world's most advanced deployment framework for premium gaming environmental enhancements.
          </p>
        </div>

        <div>
          <h4 className={cn(
            "text-xs font-bold uppercase tracking-widest mb-6",
            isCosmic ? "text-white" : "text-slate-900"
          )}>Protocol</h4>
          <ul className="space-y-3 text-sm">
            <li>Encryption Layers</li>
            <li>Kernel Security</li>
            <li>Cloud Sync</li>
            <li>V-Status Hub</li>
          </ul>
        </div>

        <div>
           <h4 className={cn(
            "text-xs font-bold uppercase tracking-widest mb-6",
            isCosmic ? "text-white" : "text-slate-900"
          )}>Compliance</h4>
          <ul className="space-y-3 text-sm">
            <li onClick={() => onViewChange('privacy')} className="cursor-pointer hover:text-cosmic-blue transition-colors">Privacy Policy</li>
            <li onClick={() => onViewChange('terms')} className="cursor-pointer hover:text-cosmic-blue transition-colors">Terms & Conditions</li>
            <li onClick={() => onViewChange('contact')} className="cursor-pointer hover:text-cosmic-blue transition-colors">Contact Us</li>
            <li className="cursor-pointer hover:text-cosmic-blue transition-colors">Refund Policy</li>
          </ul>
        </div>

        <div>
           <h4 className={cn(
            "text-xs font-bold uppercase tracking-widest mb-6",
            isCosmic ? "text-white" : "text-slate-900"
          )}>Global Presence</h4>
          <div className="flex flex-wrap gap-4 mt-4">
            <ShieldCheck size={20} />
            <Globe size={20} />
            <Mail size={20} />
          </div>
          <p className="text-xs mt-6">
            © 2026 NOVAFF ELITE. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
