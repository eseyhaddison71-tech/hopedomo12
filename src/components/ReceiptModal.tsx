import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Heart, AlertCircle } from 'lucide-react';
import { Donation } from '../types';
import { createReceiptFromDonation, formatCurrencyXAF, generatePrintableReceiptHTML } from '../services/receiptGenerator';

interface ReceiptModalProps {
  donation: Donation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ donation, isOpen, onClose }) => {
  if (!isOpen || !donation) return null;

  const receipt = createReceiptFromDonation(donation);

  const handlePrint = () => {
    const html = generatePrintableReceiptHTML(receipt);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  };

  const handleDownload = () => {
    const html = generatePrintableReceiptHTML(receipt);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${receipt.receiptNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isVerified = donation.status === 'verified' || donation.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Action Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Humanitarian Donation Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="print-receipt-btn"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              id="download-receipt-btn"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              id="close-receipt-modal-btn"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Canvas */}
        <div className="p-6 sm:p-10 space-y-8 bg-white" id="printable-receipt-content">
          {/* Header */}
          <div className="border-b-2 border-emerald-600 pb-6 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                  HopeBridge Cameroon
                </h1>
              </div>
              <p className="text-xs text-emerald-700 font-medium italic mt-1">
                “A little hope can change a life.”
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Contact: eseyhaddison71@gmail.com | +237 678 750 220
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block">
                Official Receipt
              </span>
              <div className="font-mono text-base font-bold text-slate-900">
                {receipt.receiptNumber}
              </div>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isVerified
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isVerified ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-amber-700" />
                  )}
                  <span>Status: {receipt.verificationStatus.toUpperCase()}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Received Amount
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-['Outfit',sans-serif]">
              {formatCurrencyXAF(receipt.amountXaf)}
            </div>
            <span className="text-xs text-slate-500 font-medium mt-1 block">
              Central African CFA Franc (XAF)
            </span>
          </div>

          {/* Receipt Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Donor Name
              </span>
              <span className="text-sm font-semibold text-slate-900 block">
                {receipt.donorDisplayName}
              </span>
              <span className="text-slate-500">{receipt.donorEmail}</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Date & Reference
              </span>
              <span className="text-sm font-semibold text-slate-900 block">
                {new Date(receipt.issuedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span className="font-mono text-slate-500">Ref: {receipt.donationReference}</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Designated Cause
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {receipt.causeName}
              </span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Payment Channel
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {receipt.paymentMethod === 'mtn_momo'
                  ? 'MTN Mobile Money (+237 678 750 220)'
                  : 'PayPal (eseyhaddison71@gmail.com)'}
              </span>
            </div>
          </div>

          {/* Emotional & Compassionate Thank You */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1 leading-relaxed">
            <div className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              <span>Together, we can turn compassion into action.</span>
            </div>
            <p>
              Your generosity can provide a meal, restore dignity, and give someone another reason to hope in Cameroon. On behalf of the vulnerable children and elders supported through HopeBridge Cameroon, we offer our profound thanks.
            </p>
          </div>

          {/* Legal and Transparency Disclaimer */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed space-y-1">
            <p className="font-semibold text-slate-500 uppercase tracking-wider">
              Legal Transparency Notice:
            </p>
            <p>{receipt.disclaimer}</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
