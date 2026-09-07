import React, { useState } from 'react';
import { User, Mail, Lock, History, Download, ShieldCheck, LogOut, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { UserAccount, Donation } from '../types';
import { storageService } from '../services/storage';
import { formatCurrencyXAF } from '../services/receiptGenerator';

interface DonorPortalProps {
  currentDonor: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  onViewReceipt: (donation: Donation) => void;
  onOpenDonate: () => void;
}

export const DonorPortal: React.FC<DonorPortalProps> = ({
  currentDonor,
  onLogin,
  onLogout,
  onViewReceipt,
  onOpenDonate
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('Cameroon');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentDonor?.fullName || '');
  const [editPhone, setEditPhone] = useState(currentDonor?.phoneNumber || '');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isRegistering) {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all required registration fields.');
        return;
      }
      try {
        const user = storageService.registerDonor(fullName, email, password, country, phoneNumber);
        onLogin(user);
        setSuccessMsg('Account created successfully! Welcome to HopeBridge.');
      } catch (err: any) {
        setError(err.message || 'Registration failed.');
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Please enter your email and password.');
        return;
      }
      // Demo authentication for donors:
      let user = storageService.loginDonor(email);
      if (!user) {
        // If first-time demo sign-in:
        user = storageService.registerDonor(
          email.split('@')[0] || 'Kind Supporter',
          email,
          password,
          'Cameroon'
        );
      }
      onLogin(user);
    }
  };

  const donorDonations = currentDonor ? storageService.getDonationsByEmail(currentDonor.email) : [];

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!currentDonor ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                {isRegistering ? 'Create Donor Account' : 'Donor Sign In'}
              </h2>
              <p className="text-xs text-slate-500">
                Access your full donation history, view verified receipts, and manage your profile.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4 text-xs">
              {isRegistering && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Eto’o"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+237 6..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {isRegistering ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                {isRegistering
                  ? 'Already have an account? Sign In'
                  : 'New supporter? Create a Donor Account'}
              </button>
            </div>
          </div>
        ) : (
          /* Donor Dashboard */
          <div className="space-y-8">
            {/* Header & Profile */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                  {currentDonor.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                      {currentDonor.fullName}
                    </h1>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      Verified Supporter
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{currentDonor.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={onOpenDonate}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Make a Donation
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* My Donations Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                    My Donations History
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track all your contributions and download verified humanitarian receipts.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {donorDonations.length} Donation{donorDonations.length !== 1 ? 's' : ''}
                </span>
              </div>

              {donorDonations.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-sm text-slate-500">
                    No donations found matching <strong>{currentDonor.email}</strong>.
                  </p>
                  <p className="text-xs text-slate-400">
                    If you donated recently with this email address, your transaction will show up here.
                  </p>
                  <button
                    onClick={onOpenDonate}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                  >
                    Donate to a Cause Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {donorDonations.map((don) => (
                    <div
                      key={don.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {don.referenceCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              don.status === 'verified' || don.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {don.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong>{don.causeName}</strong> • {new Date(don.createdAt).toLocaleDateString()} via{' '}
                          {don.paymentMethod === 'mtn_momo' ? 'MTN MoMo' : 'PayPal'}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <span className="text-base font-extrabold text-slate-900">
                          {formatCurrencyXAF(don.amountXaf)}
                        </span>
                        <button
                          onClick={() => onViewReceipt(don)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
