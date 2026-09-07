import React from 'react';
import { HandHeart, CheckCircle, Target, Users, AlertCircle } from 'lucide-react';
import { Cause } from '../types';
import { formatCurrencyXAF } from '../services/receiptGenerator';

interface CausesSectionProps {
  causes: Cause[];
  onDonateToCause: (causeId: string) => void;
}

export const CausesSection: React.FC<CausesSectionProps> = ({ causes, onDonateToCause }) => {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/70" id="causes-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-3.5 py-1 rounded-full mb-3">
            Primary Initiatives
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Where We Direct Your Compassion
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            Every donation is directly earmarked toward essential life-saving resources for children, the elderly, and emergency humanitarian relief in Cameroon.
          </p>
        </div>

        {/* Causes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause) => {
            const progress = Math.min(100, Math.round((cause.currentAmountXaf / cause.targetAmountXaf) * 100));

            return (
              <div
                key={cause.id}
                id={`cause-card-${cause.slug}`}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Cause Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <img
                      src={cause.imageUrl}
                      alt={cause.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                    {/* Category pill */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-md backdrop-blur-xs flex items-center gap-1.5">
                        {cause.beneficiaryGroup === 'children' && <Users className="w-3.5 h-3.5 text-sky-600" />}
                        {cause.beneficiaryGroup === 'elderly' && <Users className="w-3.5 h-3.5 text-rose-600" />}
                        {cause.beneficiaryGroup === 'emergency' && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                        <span className="capitalize">{cause.beneficiaryGroup} Relief</span>
                      </span>
                    </div>

                    {/* Progress percentage on bottom right */}
                    <div className="absolute bottom-3 right-4 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                      {progress}% Funded
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif] group-hover:text-emerald-700 transition-colors">
                      {cause.name}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {cause.shortDescription}
                    </p>

                    {/* Scope Items / Tags */}
                    <div className="pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Supported Necessities
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cause.categoryTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                          >
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Progress & Donate Button */}
                <div className="p-6 sm:p-7 pt-0 border-t border-slate-100 mt-4 space-y-4">
                  <div>
                    {/* Progress bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Raised so far</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrencyXAF(cause.currentAmountXaf)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block font-medium">Goal Target</span>
                        <span className="font-bold text-slate-600 text-sm">
                          {formatCurrencyXAF(cause.targetAmountXaf)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDonateToCause(cause.id)}
                    id={`donate-btn-${cause.slug}`}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HandHeart className="w-4 h-4 text-emerald-100" />
                    <span>Donate Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance banner */}
        <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" />
          <span>Donations are distributed to field workers upon verification of merchant MoMo and PayPal records.</span>
        </div>
      </div>
    </section>
  );
};
