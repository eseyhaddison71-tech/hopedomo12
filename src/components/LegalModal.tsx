import React, { useState } from 'react';
import { X, ShieldAlert, FileText, Lock, AlertTriangle } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'donation' | 'refund';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const [activeLegalTab, setActiveLegalTab] = useState<'privacy' | 'terms' | 'donation' | 'refund'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Legal & Transparency Policies</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prominent Authentic Account Verification Warning */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-xs text-amber-950 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>CRITICAL DONOR FRAUD PREVENTION NOTICE:</strong> Before transferring any funds, always ensure you are sending to the verified HopeBridge Cameroon accounts:
            <span className="font-mono font-bold block mt-0.5">
              • MTN Mobile Money: +237 678 750 220 (Myriam Avon Nkinda) | • PayPal: eseyhaddison71@gmail.com
            </span>
            Never send money to any alternative number or unauthorized individual claiming to represent HopeBridge Cameroon.
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 px-6 pt-3 flex border-b border-slate-200 gap-2 overflow-x-auto">
          {[
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms of Use' },
            { id: 'donation', label: 'Donation Policy' },
            { id: 'refund', label: 'Refund Policy' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLegalTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors cursor-pointer whitespace-nowrap ${
                activeLegalTab === tab.id
                  ? 'bg-white text-slate-900 border-t border-x border-slate-200 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
          {activeLegalTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Privacy Policy</h3>
              <p>
                HopeBridge Cameroon values and protects the privacy of our supporters, beneficiaries, and visitors. We collect personal contact information (such as name, email address, and phone number) solely for the purpose of communicating donation receipts, tracking reconciliation statuses, and sending occasional impact updates.
              </p>
              <h4 className="font-bold text-slate-900">Payment Data Protection:</h4>
              <p>
                We do not store credit card numbers, PayPal passwords, or MTN Mobile Money PINs. All financial transfers are processed directly on the secure networks of MTN Mobile Money and PayPal.
              </p>
              <h4 className="font-bold text-slate-900">Anonymous Donations:</h4>
              <p>
                Donors selecting the "Donate Anonymously" option have their names masked on all public transparency registers and impact documents.
              </p>
            </div>
          )}

          {activeLegalTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Terms of Use</h3>
              <p>
                By accessing HopeBridge Cameroon, you agree to use the platform in good faith to support humanitarian relief for vulnerable people in Cameroon. You agree not to submit fraudulent transaction reference numbers or attempt unauthorized administrative access.
              </p>
              <h4 className="font-bold text-slate-900">Platform Integrity:</h4>
              <p>
                All donation reference submissions are checked by authorized human verifiers before public recognition or receipt issuance. Submitting bogus or deceptive transaction references will result in immediate rejection and IP logging in our audit ledgers.
              </p>
            </div>
          )}

          {activeLegalTab === 'donation' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Donation Policy & Transparency Notice</h3>
              <p>
                All funds donated to HopeBridge Cameroon are allocated toward humanitarian purposes, including food, clothing, education, healthcare, temporary shelter, and field logistics.
              </p>
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-2">
                <p className="font-bold text-slate-900">Statutory & Tax Disclaimer:</p>
                <p>
                  HopeBridge Cameroon operates as a compassionate community humanitarian relief organization. This receipt confirms receipt of a voluntary gift to aid vulnerable persons in Cameroon. It does not constitute a tax-deductible receipt under foreign jurisdictions unless specifically recognized by your domestic tax authority.
                </p>
              </div>
            </div>
          )}

          {activeLegalTab === 'refund' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Refund Policy</h3>
              <p>
                HopeBridge Cameroon strives to process all contributions with maximum diligence. If an erroneous donation amount was entered, a duplicate transaction occurred, or a payment was submitted without authorization, please notify our team within 14 calendar days of transaction submission.
              </p>
              <p>
                Contact <strong>eseyhaddison71@gmail.com</strong> or phone <strong>+237 678 750 220</strong> with your donation reference code (e.g. HB-2026-000001) and payment receipt. Legitimate refund requests for unspent funds will be reversed via the original payment channel.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-400">HopeBridge Cameroon &copy; 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
