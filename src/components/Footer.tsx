import React from 'react';
import { Heart, ShieldCheck, Phone, Mail, MapPin, ExternalLink, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'causes' | 'transparency' | 'track' | 'about' | 'contact' | 'donor' | 'admin') => void;
  onOpenLegal: (tab: 'privacy' | 'terms' | 'donation' | 'refund') => void;
  onOpenDonate: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal, onOpenDonate }) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900" id="main-footer">
      {/* Top Banner with Tagline */}
      <div className="bg-emerald-900/60 border-b border-emerald-800/60 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-['Outfit',sans-serif] font-extrabold text-lg text-white block">
                HopeBridge Cameroon
              </span>
              <span className="text-emerald-300 text-xs italic font-medium">
                “A little hope can change a life.”
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDonate}
              id="footer-donate-cta"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              About HopeBridge
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              A grassroots humanitarian relief organization dedicated to providing immediate nourishment, clothing, school supplies, and medical assistance to homeless street youth and vulnerable elders in Cameroon.
            </p>
            <div className="pt-1 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Transparent Field Reconciliation</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Explore & Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('causes')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Active Humanitarian Causes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('transparency')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Where Your Donation Goes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Track Donation Reference
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Mission, Vision & Values
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Contact & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('donor')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Donor Account Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Verification Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Official Receiving Accounts
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  MTN Mobile Money
                </span>
                <span className="font-mono text-white font-bold block">+237 678 750 220</span>
                <span className="text-slate-400 block">Name: Myriam Avon Nkinda</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                  PayPal Receiving Account
                </span>
                <span className="font-mono text-white font-bold block">eseyhaddison71@gmail.com</span>
                <span className="text-slate-400 block">International Support Desk</span>
              </div>
            </div>
          </div>

          {/* Col 4: Transparency & Policies */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Integrity & Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Terms of Use
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('donation')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Donation Policy & Tax Notice
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('refund')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Refund Policy
                </button>
              </li>
              <li className="pt-2 border-t border-slate-900">
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Authorized Staff Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Fraud Notice */}
        <div className="mt-12 pt-8 border-t border-slate-900 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p>
            &copy; {new Date().getFullYear()} HopeBridge Cameroon. “A little hope can change a life.” All rights reserved.
          </p>
          <p className="text-[11px] text-slate-400 max-w-md">
            Notice: Never send money to unverified personal accounts. Official funds are only accepted at +237 678 750 220 (Myriam Avon Nkinda) and eseyhaddison71@gmail.com.
          </p>
        </div>
      </div>
    </footer>
  );
};
