import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, AlertCircle, RefreshCw, FileText, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { Donation } from '../types';
import { storageService } from '../services/storage';
import { formatCurrencyXAF } from '../services/receiptGenerator';

interface DonationTrackerProps {
  initialReference?: string;
  onViewReceipt: (donation: Donation) => void;
  onDonateClick: () => void;
}

export const DonationTracker: React.FC<DonationTrackerProps> = ({
  initialReference = '',
  onViewReceipt,
  onDonateClick
}) => {
  const [referenceCode, setReferenceCode] = useState(initialReference);
  const [donorEmail, setDonorEmail] = useState('');
  const [searchedDonation, setSearchedDonation] = useState<Donation | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setHasSearched(true);

    if (!referenceCode.trim()) {
      setSearchError('Please enter a donation reference code (e.g. HB-2026-000001).');
      setSearchedDonation(null);
      return;
    }

    const found = storageService.getDonationByReference(referenceCode.trim(), donorEmail.trim() || undefined);
    if (!found) {
      setSearchError(
        donorEmail.trim()
          ? 'No donation found matching this reference code and email address.'
          : 'No donation found matching this reference code. Please verify the code on your confirmation.'
      );
      setSearchedDonation(null);
    } else {
      setSearchedDonation(found);
    }
  };

  const getStatusBadge = (status: Donation['status']) => {
    switch (status) {
      case 'verified':
      case 'completed':
        return {
          label: 'Verified',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          description: 'Payment verified against official statements. Funds allocated directly to field relief.'
        };
      case 'pending':
        return {
          label: 'Pending Verification',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock,
          description: 'Donation received. Pending verification against MTN Mobile Money or PayPal accounts.'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          color: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: AlertCircle,
          description: 'Transaction ID could not be reconciled. Please contact our support team.'
        };
      case 'refunded':
        return {
          label: 'Refunded',
          color: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: RefreshCw,
          description: 'Donation has been refunded to the sender.'
        };
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-3.5 py-1 rounded-full mb-3">
            Donation Verification Tracker
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Track Your Humanitarian Gift
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            HopeBridge Cameroon maintains complete transparency. Enter your unique donation reference code to verify the current reconciliation status.
          </p>
        </div>

        {/* Search Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-10">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Donation Reference Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. HB-2026-000001"
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                    id="tracker-reference-input"
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 font-mono text-sm uppercase bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Donor Email (Optional for Verification)
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  id="tracker-email-input"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                Tip: Try demo reference <strong className="text-emerald-700 font-mono">HB-2026-000001</strong> to view an active verified donation.
              </span>
              <button
                type="submit"
                id="tracker-submit-btn"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Status</span>
              </button>
            </div>
          </form>

          {searchError && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Search Results Display */}
        {hasSearched && searchedDonation && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in duration-300">
            {/* Top Status Header */}
            {(() => {
              const badge = getStatusBadge(searchedDonation.status);
              const Icon = badge.icon;
              return (
                <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
                      Donation Reference
                    </span>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
                        {searchedDonation.referenceCode}
                      </h2>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{badge.label}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                      {formatCurrencyXAF(searchedDonation.amountXaf)}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Detailed Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Status explanation notice */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">
                    {searchedDonation.status === 'pending'
                      ? 'Reconciliation In Progress'
                      : 'Verification Completed'}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {getStatusBadge(searchedDonation.status).description}
                  </p>
                  {searchedDonation.verificationNotes && (
                    <p className="text-xs text-slate-800 mt-2 font-medium italic bg-white p-2 rounded-lg border border-slate-200">
                      Staff Note: “{searchedDonation.verificationNotes}”
                    </p>
                  )}
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Donor Name</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {searchedDonation.isAnonymous ? 'Anonymous Donor' : searchedDonation.donorName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Supported Cause</span>
                  <span className="font-bold text-slate-900 text-sm truncate block">
                    {searchedDonation.causeName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Payment Method</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {searchedDonation.paymentMethod === 'mtn_momo' ? 'MTN Mobile Money' : 'PayPal'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Submission Date</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {new Date(searchedDonation.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Receipt Action */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Official Humanitarian Receipt
                  </h4>
                  <p className="text-xs text-slate-500">
                    {searchedDonation.status === 'verified' || searchedDonation.status === 'completed'
                      ? 'Your receipt is ready for download and print.'
                      : 'Download will display provisional status until administrator verification completes.'}
                  </p>
                </div>

                <button
                  onClick={() => onViewReceipt(searchedDonation)}
                  id="tracker-view-receipt-btn"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Download / View Receipt</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
          <h4 className="text-sm font-bold text-slate-900">
            Have questions about your donation?
          </h4>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Our coordination team in Cameroon verifies transactions against physical bank & MTN MoMo Merchant statements every day. If you need urgent assistance, contact +237 678 750 220.
          </p>
        </div>
      </div>
    </div>
  );
};
