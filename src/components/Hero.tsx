import React from 'react';
import { HandHeart, ArrowRight, ShieldCheck, CheckCircle2, HeartHandshake, MapPin } from 'lucide-react';

interface HeroProps {
  onDonateClick: () => void;
  onMissionClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDonateClick, onMissionClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200/60">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl opacity-70 pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 -z-10 w-80 h-80 bg-sky-100/60 rounded-full blur-3xl opacity-70 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Mission copy & CTAs */}
          <div className="lg:col-span-7 space-y-7">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-800 text-xs sm:text-sm font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>HopeBridge Cameroon</span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-900 font-bold italic">“A little hope can change a life.”</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] font-['Outfit',sans-serif]">
              Help Us Give Hope to Those Who{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 underline decoration-amber-400 decoration-wavy decoration-2">
                Need It Most.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
              Your donation can help provide food, shelter, clothing, healthcare, education, and basic necessities to homeless children and vulnerable elderly people in Cameroon.
            </p>

            {/* Humanitarian quote */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3.5 max-w-xl">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <p className="text-sm text-slate-700 italic leading-snug">
                “Your generosity can provide a meal, restore dignity, and give someone another reason to hope.”
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onDonateClick}
                id="hero-donate-now-btn"
                className="px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 transition-all duration-200 flex items-center gap-3 cursor-pointer group"
              >
                <HandHeart className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
                <span>Donate Now</span>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onMissionClick}
                id="hero-our-mission-btn"
                className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 font-bold text-base border border-slate-300/80 shadow-xs hover:border-slate-400 transition-all duration-200 cursor-pointer"
              >
                Our Mission
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Field Distribution</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Audited Verification Ledger</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>On Ground in Cameroon</span>
              </div>
            </div>
          </div>

          {/* Right Column: Humanitarian imagery card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 sm:aspect-5/4">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop"
                  alt="Vulnerable children in Cameroon receiving educational and food support"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600/90 text-white text-xs font-semibold mb-1 backdrop-blur-xs">
                    <MapPin className="w-3 h-3" />
                    <span>Cameroon Outreach</span>
                  </div>
                  <p className="text-sm font-medium text-slate-100">
                    Direct meals, clothing, and schooling for children in need.
                  </p>
                </div>
              </div>

              {/* Floating Verified Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-200/90 flex items-center gap-3.5 max-w-[280px]">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Verified Channels
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    MTN MoMo & PayPal
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium">
                    Manual staff verification
                  </div>
                </div>
              </div>

              {/* Floating Impact pill */}
              <div className="absolute -top-4 -right-4 bg-amber-500 text-slate-950 px-4 py-2 rounded-2xl shadow-lg border-2 border-white flex items-center gap-2">
                <span className="font-extrabold text-sm">100% Dedicated</span>
                <span className="text-xs font-semibold text-amber-950">To Practical Relief</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
