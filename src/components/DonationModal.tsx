import React, { useState } from 'react';
import {
  X,
  Heart,
  Smartphone,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
  Calendar,
  Lock
} from 'lucide-react';
import { Cause, Donation, PaymentMethodType, DonationFrequency } from '../types';
import { storageService } from '../services/storage';
import { formatCurrencyXAF } from '../services/receiptGenerator';
import { MTNMoMoProvider } from '../services/payment/mtnMoMoProvider';
import { PayPalProvider } from '../services/payment/payPalProvider';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  causes: Cause[];
  initialCauseId?: string;
  onDonationSuccess: (donation: Donation) => void;
}

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000, 25000, 50000];

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  causes,
  initialCauseId,
  onDonationSuccess
}) => {
  // Form State
  const [frequency, setFrequency] = useState<DonationFrequency>('one_time');
  const [selectedCauseId, setSelectedCauseId] = useState<string>(
    initialCauseId || (causes[0] ? causes[0].id : '')
  );
  const [selectedPreset, setSelectedPreset] = useState<number | null>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Donor Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('Cameroon');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessage, setDonorMessage] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('mtn_momo');
  const [transactionId, setTransactionId] = useState('');
  const [hasCopiedMomo, setHasCopiedMomo] = useState(false);
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);

  // Workflow State
  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [submittedDonation, setSubmittedDonation] = useState<Donation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentAmount = selectedPreset !== null ? selectedPreset : Number(customAmount) || 0;
  const activeCause = causes.find((c) => c.id === selectedCauseId) || causes[0];

  const mtnProvider = new MTNMoMoProvider();
  const payPalProvider = new PayPalProvider();

  const handleCopy = (text: string, type: 'momo' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'momo') {
      setHasCopiedMomo(true);
      setTimeout(() => setHasCopiedMomo(false), 2000);
    } else {
      setHasCopiedEmail(true);
      setTimeout(() => setHasCopiedEmail(false), 2000);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (currentAmount < 500) {
      setErrorMessage('Please select or enter a valid donation amount (minimum 500 XAF).');
      return;
    }
    if (!fullName.trim() && !isAnonymous) {
      setErrorMessage('Please provide your name or check "Donate Anonymously".');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address to receive your confirmation and receipt.');
      return;
    }

    setCurrentStep('payment');
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!transactionId.trim()) {
      setErrorMessage(
        paymentMethod === 'mtn_momo'
          ? 'Please enter your MTN Mobile Money SMS Transaction/Reference ID.'
          : 'Please enter your PayPal Transaction/Order ID.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Create donation record in pending status
      const newDonation = storageService.createDonation({
        donorName: isAnonymous ? 'Anonymous Donor' : fullName.trim(),
        donorEmail: email.trim(),
        donorPhone: phoneNumber.trim() || undefined,
        donorCountry: country.trim() || 'Cameroon',
        amountXaf: currentAmount,
        frequency,
        isAnonymous,
        donorMessage: donorMessage.trim() || undefined,
        causeId: activeCause ? activeCause.id : 'general',
        causeName: activeCause ? activeCause.name : 'General Relief Fund',
        paymentMethod,
        providerTransactionId: transactionId.trim(),
        verificationNotes: `Initial submission. Entered ${paymentMethod === 'mtn_momo' ? 'MTN MoMo' : 'PayPal'} reference: ${transactionId.trim()}`
      });

      setSubmittedDonation(newDonation);
      onDonationSuccess(newDonation);
      setCurrentStep('confirmation');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenPayPal = () => {
    const usdEstimate = Math.max(2, Math.round(currentAmount / 600));
    const memo = encodeURIComponent(`HopeBridge Cameroon Donation: ${activeCause?.name || 'Relief'}`);
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${encodeURIComponent(
      payPalProvider.receivingEmail
    )}&item_name=${memo}&currency_code=USD&amount=${usdEstimate}`;
    window.open(paypalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif]">
                {currentStep === 'confirmation' ? 'Donation Received' : 'Make a Compassionate Donation'}
              </h2>
              <p className="text-xs text-slate-300">
                HopeBridge Cameroon • “A little hope can change a life.”
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close-donation-modal-btn"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 'details' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              1
            </span>
            <span className={currentStep === 'details' ? 'text-slate-900 font-bold' : ''}>Amount & Cause</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 'payment' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className={currentStep === 'payment' ? 'text-slate-900 font-bold' : ''}>Payment Method</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 'confirmation' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className={currentStep === 'confirmation' ? 'text-slate-900 font-bold' : ''}>Verification</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Details & Amount */}
          {currentStep === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* Frequency Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Donation Frequency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFrequency('one_time')}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      frequency === 'one_time'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <span>One-Time Donation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      frequency === 'monthly'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Monthly Supporter</span>
                  </button>
                </div>
              </div>

              {/* Cause Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Designate Donation To
                </label>
                <select
                  value={selectedCauseId}
                  onChange={(e) => setSelectedCauseId(e.target.value)}
                  id="donation-cause-select"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                >
                  {causes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preset Amounts Grid */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Amount (XAF)
                  </label>
                  <span className="text-xs text-emerald-700 font-semibold">
                    1 USD ≈ 600 XAF
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = selectedPreset === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(amt);
                          setCustomAmount('');
                        }}
                        className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {amt.toLocaleString()} XAF
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount */}
                <div className="mt-3">
                  <div className="relative">
                    <input
                      type="number"
                      min="500"
                      step="500"
                      placeholder="Or enter custom amount in XAF"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedPreset(null);
                      }}
                      id="donation-custom-amount"
                      className="w-full pl-4 pr-16 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      XAF
                    </span>
                  </div>
                </div>
              </div>

              {/* Donor Personal Information */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Donor Details
                  </h3>
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Donate Anonymously</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Full Name {!isAnonymous && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      type="text"
                      required={!isAnonymous}
                      placeholder={isAnonymous ? 'Anonymous Donor' : 'e.g. Samuel Eto’o'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isAnonymous}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+237 6..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Optional Message of Encouragement
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Share a short word of hope for the children or elders..."
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  ></textarea>
                </div>
              </div>

              {/* Proceed Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  id="donation-proceed-to-payment-btn"
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment: {formatCurrencyXAF(currentAmount)}</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Execution & Transaction ID */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep('details')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Amount / Details</span>
                </button>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Gift:</span>
                  <span className="ml-1.5 font-bold text-emerald-700 text-base">
                    {formatCurrencyXAF(currentAmount)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Choose Payment Channel
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('mtn_momo');
                      setTransactionId('');
                    }}
                    id="payment-tab-mtn"
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'mtn_momo'
                        ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      <span>MTN Mobile Money</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Cameroon & CEMAC (+237)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('paypal');
                      setTransactionId('');
                    }}
                    id="payment-tab-paypal"
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'paypal'
                        ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <CreditCard className="w-4 h-4 text-sky-600" />
                      <span>PayPal</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">International & Cards</p>
                  </button>
                </div>
              </div>

              {/* METHOD 1: MTN MOBILE MONEY DETAILS */}
              {paymentMethod === 'mtn_momo' && (
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        Official MTN MoMo Recipient
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                        {mtnProvider.recipientName}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Official Authorized Financial Officer for HopeBridge Cameroon
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 font-mono font-bold text-slate-900 text-sm flex items-center gap-2 shadow-2xs">
                        <span>{mtnProvider.recipientNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(mtnProvider.recipientNumber, 'momo')}
                          className="text-amber-700 hover:text-amber-900 cursor-pointer"
                          title="Copy number"
                        >
                          {hasCopiedMomo ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step-by-step instructions */}
                  <div className="bg-white p-4 rounded-xl border border-amber-200/80 space-y-2 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">Follow these simple steps on your mobile phone:</p>
                    <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                      <li>Enter amount: <strong>{formatCurrencyXAF(currentAmount)}</strong></li>
                      <li>
                        Send the donation through MTN Mobile Money to{' '}
                        <strong className="text-amber-900">{mtnProvider.recipientNumber}</strong> ({mtnProvider.recipientName}).
                      </li>
                      <li>Keep your transaction/reference ID from the MTN SMS confirmation.</li>
                      <li>Return to this window.</li>
                      <li>Enter your MTN transaction/reference ID in the box below.</li>
                      <li>Submit the donation for verification.</li>
                      <li>
                        Your donation will show as <strong>Pending Verification</strong> until an authorized administrator confirms it.
                      </li>
                    </ol>
                  </div>

                  {/* Ethical and Security Warning */}
                  <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
                    <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-800" />
                    <p>
                      <strong>Security Guarantee:</strong> HopeBridge Cameroon will <strong>NEVER</strong> ask for your secret Mobile Money PIN. Only enter your PIN on your own phone when authorizing the transfer.
                    </p>
                  </div>
                </div>
              )}

              {/* METHOD 2: PAYPAL DETAILS */}
              {paymentMethod === 'paypal' && (
                <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-900">
                        PayPal Receiving Account
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                        {payPalProvider.receivingEmail}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Designated International Receiver for HopeBridge Cameroon
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(payPalProvider.receivingEmail, 'email')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-sky-300 text-xs font-semibold text-sky-800 flex items-center gap-1.5 shadow-2xs hover:bg-sky-50 cursor-pointer"
                    >
                      {hasCopiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Email</span>
                    </button>
                  </div>

                  {/* PayPal Action Button */}
                  <div className="p-4 rounded-xl bg-white border border-sky-200 text-center space-y-2">
                    <p className="text-xs text-slate-600">
                      Estimated conversion: <strong>${Math.max(2, Math.round(currentAmount / 600))} USD</strong>
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenPayPal}
                      id="paypal-external-donate-btn"
                      className="w-full py-3 px-4 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Donate with PayPal</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <p className="text-[11px] text-slate-500">
                      Opens PayPal in a secure window. Complete your gift, then enter your PayPal Transaction ID below.
                    </p>
                  </div>

                  {/* Important note */}
                  <div className="p-3 rounded-xl bg-sky-100/70 border border-sky-300 text-xs text-sky-950 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-sky-800" />
                    <p>
                      <strong>Verification Notice:</strong> Clicking the PayPal button does not automatically verify payment. Your donation remains pending until staff reconciles account records.
                    </p>
                  </div>
                </div>
              )}

              {/* Transaction ID Submission Form */}
              <form onSubmit={handleSubmitDonation} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {paymentMethod === 'mtn_momo'
                      ? 'Enter MTN MoMo Transaction / Reference ID *'
                      : 'Enter PayPal Transaction ID / Receipt Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      paymentMethod === 'mtn_momo'
                        ? 'e.g. 1928374652 or MTN-TX-8829'
                        : 'e.g. 9RT88201 or 5XY771928'
                    }
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    id="donation-transaction-id-input"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Found in your official confirmation SMS (MTN) or email confirmation (PayPal).
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="submit-donation-verification-btn"
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting for Verification...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-100" />
                      <span>Submit Donation for Verification</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Confirmation View */}
          {currentStep === 'confirmation' && submittedDonation && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8 text-amber-600" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 mb-2">
                  Status: Pending Verification
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  Thank you for supporting HopeBridge Cameroon.
                </h3>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  “Your donation has been received and is currently pending verification.”
                </p>
              </div>

              {/* Reference Card */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-500 pb-2 border-b border-slate-200">
                  <span>Donation Reference Code</span>
                  <button
                    onClick={() => handleCopy(submittedDonation.referenceCode, 'momo')}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>

                <div className="text-center py-1 font-mono text-2xl font-extrabold text-slate-900 tracking-wider">
                  {submittedDonation.referenceCode}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Amount</span>
                    <span className="font-bold text-slate-800">
                      {formatCurrencyXAF(submittedDonation.amountXaf)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Designation</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {submittedDonation.causeName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Method</span>
                    <span className="font-bold text-slate-800">
                      {submittedDonation.paymentMethod === 'mtn_momo' ? 'MTN Mobile Money' : 'PayPal'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Transaction ID</span>
                    <span className="font-mono text-slate-800 font-semibold truncate block">
                      {submittedDonation.providerTransactionId}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                An email notification has been queued to <strong>{submittedDonation.donorEmail}</strong>. Once our authorized financial team verifies your transaction against account statements, your official donation receipt will become downloadable.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
