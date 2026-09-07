import React from 'react';
import {
  PieChart,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Coins,
  FileCheck,
  HeartHandshake
} from 'lucide-react';
import { ImpactReport } from '../types';
import { formatCurrencyXAF } from '../services/receiptGenerator';

interface TransparencyViewProps {
  impactReports: ImpactReport[];
  onDonateClick: () => void;
}

export const TransparencyView: React.FC<TransparencyViewProps> = ({ impactReports, onDonateClick }) => {
  const expenseCategories = [
    {
      title: 'Food & Nutrition Kits',
      percentage: '30%',
      color: 'bg-emerald-500',
      description: 'Hot community kitchens, bulk rice, grain bags, and daily sustenance for street youth.'
    },
    {
      title: 'Healthcare & Chronic Medicine',
      percentage: '22%',
      color: 'bg-teal-500',
      description: 'Prescription refills for hypertension, arthritis, and malaria treatments for the elderly.'
    },
    {
      title: 'Education & School Supplies',
      percentage: '18%',
      color: 'bg-sky-500',
      description: 'Primary school fees, textbooks, mathematics sets, and uniforms for rehabilitated children.'
    },
    {
      title: 'Emergency Shelter & Bedding',
      percentage: '15%',
      color: 'bg-amber-500',
      description: 'Warm blankets, weather-safe shelter grants, and temporary roof repairs.'
    },
    {
      title: 'Clothing, Hygiene & Clean Water',
      percentage: '9%',
      color: 'bg-indigo-500',
      description: 'Sanitary supplies, soap, clean shirts, shoes, and hygiene packs.'
    },
    {
      title: 'Field Logistics & MoMo Verification',
      percentage: '6%',
      color: 'bg-slate-400',
      description: 'Local volunteer transport, communication, and bank statement audit reconciliation.'
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-3.5 py-1 rounded-full mb-3">
            Absolute Financial Accountability
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Where Your Donation Goes
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            At HopeBridge Cameroon, we believe every donor has the absolute right to know how their hard-earned contributions are utilized. No vague promises; only documented humanitarian delivery.
          </p>
        </div>

        {/* Breakdown Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Relief Expenditure Allocation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Typical deployment ratio for every 10,000 XAF donated to HopeBridge Cameroon.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>94% Direct Field Aid Deployment</span>
            </div>
          </div>

          {/* Allocation Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expenseCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {cat.title}
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                    {cat.percentage}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{ width: cat.percentage }}
                  ></div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Public Impact Reports Section */}
        <div className="space-y-8" id="impact-reports-list">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-3.5 py-1 rounded-full mb-2">
                Documented Fieldwork
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                Verified Impact Reports
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Published by authorized HopeBridge administrators upon completion of field aid deliveries.
              </p>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {impactReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo Carousel or Featured Image */}
                  {report.photos && report.photos.length > 0 && (
                    <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                      <img
                        src={report.photos[0]}
                        alt={report.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{report.location}</span>
                      </div>
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(report.reportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                      {report.causeName && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">{report.causeName}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                      {report.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </div>

                {/* Key Metrics Footnote */}
                <div className="p-6 sm:p-7 pt-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Beneficiaries Reached
                    </span>
                    <div className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>{report.beneficiariesReached} People</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Expenditure Disbursed
                    </span>
                    <div className="text-lg font-extrabold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                      <Coins className="w-4 h-4 text-emerald-600" />
                      <span>{formatCurrencyXAF(report.amountSpentXaf)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
          <HeartHandshake className="w-12 h-12 text-emerald-300 mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
            Together, We Can Turn Compassion into Action
          </h3>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Your support reaches vulnerable children and elders with absolute honesty, zero inflation, and verifiable receipts.
          </p>
          <div className="pt-2">
            <button
              onClick={onDonateClick}
              className="px-8 py-4 rounded-2xl bg-white text-emerald-900 font-extrabold text-base hover:bg-emerald-50 active:bg-emerald-100 shadow-lg cursor-pointer"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
