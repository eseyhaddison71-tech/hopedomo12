import React from 'react';
import {
  Heart,
  Target,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  HandHeart,
  Lock
} from 'lucide-react';

interface AboutViewProps {
  onDonateClick: () => void;
  onContactClick: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onDonateClick, onContactClick }) => {
  return (
    <div className="py-12 sm:py-20 bg-white min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-3.5 py-1 rounded-full">
            Our Purpose & Compassion
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            About HopeBridge Cameroon
          </h1>
          <p className="text-lg text-emerald-800 font-semibold italic">
            “A little hope can change a life.”
          </p>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            HopeBridge Cameroon is a humanitarian initiative established to mobilize compassionate donors and directly connect financial gifts with practical, life-sustaining aid for homeless children, vulnerable elderly individuals, and families enduring difficult conditions in Cameroon.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Our Mission
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To identify the most vulnerable members of society in Cameroon—especially children living on urban streets and elders with no family support—and deliver rapid, respectful, and verified food, shelter, clothing, medical care, and educational assistance.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Our Vision
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A Cameroon where no child is abandoned to sleep on the pavement without nourishment or school access, and where every senior citizen receives healthcare, warm shelter, and dignified human companionship in their twilight years.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Our Core Values
            </h3>
            <p className="text-sm text-slate-500 mt-1">The foundational ethical principles governing every action we take.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Compassion</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Treating every child and elder with reverence, warmth, and human dignity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Integrity</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Reconciling every Franc against official statements without exaggeration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Transparency</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Open verification ledgers and documented photographic impact reporting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto font-bold">
                <HandHeart className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Community</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Working hand-in-hand with grassroots community leaders on the ground.
              </p>
            </div>
          </div>
        </div>

        {/* How Donations Are Handled */}
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              Financial Stewardship
            </span>
            <h3 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              How Your Donations Are Handled
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              From the moment you click donate to the delivery of warm meals and clinic receipts:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase">Step 01</div>
              <h4 className="font-bold text-slate-900">Direct Deposit & Submission</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Donors transfer funds directly to verified accounts (MTN MoMo: <strong>+237 678 750 220</strong>, Myriam Avon Nkinda; or PayPal: <strong>eseyhaddison71@gmail.com</strong>) and log their transaction reference.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase">Step 02</div>
              <h4 className="font-bold text-slate-900">Account Statement Reconciliation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authorized administrators match the transaction ID against actual bank/MoMo statements. The donation changes from <strong>Pending</strong> to <strong>Verified</strong>, generating an official receipt.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase">Step 03</div>
              <h4 className="font-bold text-slate-900">Field Deployment & Reporting</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Funds are immediately deployed to purchase clinic medicines, school uniforms, and food bulk. Our field team publishes an audited impact report documenting expenditures and beneficiaries.
              </p>
            </div>
          </div>
        </div>

        {/* Verified Organization & Contact Information Placeholder */}
        <div className="p-8 rounded-3xl bg-white border-2 border-dashed border-slate-300 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Verified Administrative & Contact Information</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            <em>Transparency standard: HopeBridge Cameroon does not fabricate government NGO registration numbers or fictitious partnerships. Official legal and tax status filings are updated as finalized by local authorities.</em>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block mb-1">Official Receiver & Liaison</span>
              <span className="font-bold text-slate-900">Myriam Avon Nkinda</span>
              <span className="text-slate-500 block mt-0.5">Financial & Outreach Coordinator</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block mb-1">Official Phone / WhatsApp</span>
              <span className="font-mono font-bold text-slate-900">+237 678 750 220</span>
              <span className="text-slate-500 block mt-0.5">Cameroon (+237)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block mb-1">Official Email</span>
              <span className="font-bold text-slate-900">eseyhaddison71@gmail.com</span>
              <span className="text-slate-500 block mt-0.5">International & Donor Desk</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <button
            onClick={onDonateClick}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            Support Our Mission Today
          </button>
        </div>
      </div>
    </div>
  );
};
