import React from 'react';
import { Users, Heart, Utensils, Home, RefreshCw } from 'lucide-react';
import { ImpactStats as ImpactStatsType } from '../types';

interface ImpactStatsProps {
  stats: ImpactStatsType;
  onRefresh?: () => void;
}

export const ImpactStats: React.FC<ImpactStatsProps> = ({ stats, onRefresh }) => {
  const statCards = [
    {
      id: 'stat-children',
      title: 'Children Supported',
      value: stats.childrenSupported,
      unit: 'Boys & Girls',
      icon: Users,
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-600',
      borderColor: 'border-sky-200/80',
      description: 'Street-connected children provided food, clothing, and school supplies.'
    },
    {
      id: 'stat-elderly',
      title: 'Elderly People Supported',
      value: stats.elderlySupported,
      unit: 'Elders Cared For',
      icon: Heart,
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-200/80',
      description: 'Vulnerable seniors receiving chronic medicines, blankets, and groceries.'
    },
    {
      id: 'stat-meals',
      title: 'Meals Provided',
      value: stats.mealsProvided,
      unit: 'Nutritious Meals',
      icon: Utensils,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200/80',
      description: 'Balanced hot meals and dry ration packs distributed to families.'
    },
    {
      id: 'stat-families',
      title: 'Families Reached',
      value: stats.familiesReached,
      unit: 'Households',
      icon: Home,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200/80',
      description: 'Emergency accommodation, medical clinic triage, and crisis relief.'
    }
  ];

  return (
    <section className="py-14 bg-white border-b border-slate-200/60" id="impact-stats-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-2">
              Verified Community Impact
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Tangible Help Reaching Vulnerable People
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
              Every figure below represents real humanitarian relief delivered by HopeBridge Cameroon volunteers and partners.
            </p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors self-start md:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Live Ledger Data</span>
            </button>
          )}
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={card.id}
                className={`p-6 rounded-2xl bg-white border ${card.borderColor} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${card.bgColor} ${card.iconColor} flex items-center justify-center font-bold`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {card.unit}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                    {card.value.toLocaleString()}
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mt-1">
                    {card.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Accountability statement banner */}
        <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              <strong>Transparency Note:</strong> Statistics are updated continuously upon physical receipt and verification of field aid deliveries.
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Last updated: {new Date(stats.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
    </section>
  );
};
