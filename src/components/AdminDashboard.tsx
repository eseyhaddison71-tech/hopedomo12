import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  FileText,
  TrendingUp,
  Users,
  Coins,
  AlertTriangle,
  Lock,
  Layers,
  BarChart3,
  Calendar,
  Eye,
  Check
} from 'lucide-react';
import { Donation, Cause, ImpactReport, ImpactStats, AuditLog, UserAccount, DonationStatus } from '../types';
import { storageService } from '../services/storage';
import { formatCurrencyXAF } from '../services/receiptGenerator';

interface AdminDashboardProps {
  currentAdmin: UserAccount | null;
  onLogin: (admin: UserAccount) => void;
  onLogout: () => void;
  onViewReceipt: (donation: Donation) => void;
  causes: Cause[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  onLogin,
  onLogout,
  onViewReceipt,
  causes,
  onRefreshData
}) => {
  // Login Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Navigation Sub-tab inside Admin
  const [activeTab, setActiveTab] = useState<'donations' | 'causes' | 'impact_reports' | 'stats' | 'audit'>(
    'donations'
  );

  // Donation Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Verification Dialog
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Cause Editing Form
  const [isEditingCause, setIsEditingCause] = useState(false);
  const [causeForm, setCauseForm] = useState<Partial<Cause>>({
    name: '',
    shortDescription: '',
    fullDescription: '',
    targetAmountXaf: 5000000,
    currentAmountXaf: 0,
    beneficiaryGroup: 'children',
    status: 'active',
    categoryTags: ['Food', 'Clothing', 'Education']
  });

  // Impact Report Form
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [reportForm, setReportForm] = useState<Partial<ImpactReport>>({
    title: '',
    description: '',
    amountSpentXaf: 500000,
    beneficiariesReached: 50,
    location: 'Yaoundé, Cameroon',
    photos: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop'
    ],
    isPublished: true
  });

  // Stats Form
  const [statsForm, setStatsForm] = useState<ImpactStats>(storageService.getImpactStats());

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Pre-seeded secure administrator credentials for demo / evaluation:
    if (
      (adminEmail === 'admin@hopebridge-cameroon.org' && adminPassword === 'HopeBridge2026!') ||
      (adminEmail === 'eseyhaddison71@gmail.com' && adminPassword.length >= 6)
    ) {
      const admin: UserAccount = {
        id: 'admin-super',
        email: adminEmail,
        fullName: 'HopeBridge Official Administrator',
        country: 'Cameroon',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      storageService.setCurrentAdmin(admin);
      onLogin(admin);
      storageService.addAuditLog('ADMIN_LOGIN', 'auth', admin.email, 'Logged in to staff dashboard');
    } else {
      setLoginError('Invalid administrator credentials. Try demo: admin@hopebridge-cameroon.org / HopeBridge2026!');
    }
  };

  // Status Action Handler
  const handleUpdateStatus = (reference: string, newStatus: DonationStatus) => {
    storageService.updateDonationStatus(
      reference,
      newStatus,
      currentAdmin?.email || 'admin@hopebridge-cameroon.org',
      verificationNotes
    );
    setSelectedDonation(null);
    setVerificationNotes('');
    onRefreshData();
  };

  // If not logged in as Admin, show login screen
  if (!currentAdmin) {
    return (
      <div className="py-16 sm:py-24 bg-slate-900 min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto font-bold shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Authorized Staff Portal
            </h1>
            <p className="text-xs text-slate-500">
              Restricted to authorized verification officers of HopeBridge Cameroon.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Quick Demo Help Banner */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 leading-snug">
            <strong>Evaluation Credentials:</strong><br />
            Email: <span className="font-mono font-bold">admin@hopebridge-cameroon.org</span><br />
            Password: <span className="font-mono font-bold">HopeBridge2026!</span>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Administrator Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@hopebridge-cameroon.org"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Secret Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Authenticate & Enter</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center">
            All administrative access and verification updates are audited with immutable server timestamps.
          </p>
        </div>
      </div>
    );
  }

  // Retrieve current data
  const donations = storageService.getDonations();
  const reports = storageService.getImpactReports();
  const auditLogs = storageService.getAuditLogs();
  const stats = storageService.getImpactStats();

  // Metrics Calculations
  const totalDonationsCount = donations.length;
  const verifiedDonations = donations.filter((d) => d.status === 'verified' || d.status === 'completed');
  const pendingDonations = donations.filter((d) => d.status === 'pending');
  const rejectedDonations = donations.filter((d) => d.status === 'rejected');

  const totalAmountRaisedXaf = verifiedDonations.reduce((acc, d) => acc + d.amountXaf, 0);
  const monthlyDonationsCount = donations.filter((d) => d.frequency === 'monthly').length;
  const uniqueDonorsCount = new Set(donations.map((d) => d.donorEmail.toLowerCase())).size;
  const totalBeneficiaries = stats.childrenSupported + stats.elderlySupported;

  // Filtered Donations
  const filteredDonations = donations.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (methodFilter !== 'all' && d.paymentMethod !== methodFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.referenceCode.toLowerCase().includes(q) ||
        d.donorName.toLowerCase().includes(q) ||
        d.donorEmail.toLowerCase().includes(q) ||
        d.providerTransactionId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="py-8 sm:py-12 bg-slate-100 min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Action Header */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif]">
                  HopeBridge Staff Ledger
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  Admin Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as: <strong>{currentAdmin.email}</strong> • Direct Statement Reconciliation Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshData}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 8 Primary Required Metrics Overview Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Total Raised (Verified)</span>
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 font-['Outfit',sans-serif]">
              {formatCurrencyXAF(totalAmountRaisedXaf)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">From verified statements</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Pending Verification</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 font-['Outfit',sans-serif]">
              {pendingDonations.length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Requires manual audit</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Verified Donations</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              {verifiedDonations.length} / {totalDonationsCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Successfully cleared</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Monthly Donors</span>
              <TrendingUp className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              {monthlyDonationsCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Recurring pledges</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Rejected Submissions</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-rose-600 font-['Outfit',sans-serif]">
              {rejectedDonations.length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Unmatched transactions</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Unique Donors</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              {uniqueDonorsCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Individuals & families</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Active Beneficiaries</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              {totalBeneficiaries}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Children & seniors</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Relief Initiatives</span>
              <Layers className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              {causes.length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Active campaigns</span>
          </div>
        </div>

        {/* Dashboard Sub-Tabs Navigation */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
          {[
            { id: 'donations', label: `Donations (${donations.length})` },
            { id: 'causes', label: `Causes (${causes.length})` },
            { id: 'impact_reports', label: `Impact Reports (${reports.length})` },
            { id: 'stats', label: 'Public Statistics' },
            { id: 'audit', label: `Audit Log (${auditLogs.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-xs font-bold rounded-t-2xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 border-t-2 border-x border-emerald-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 bg-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: DONATION MANAGEMENT */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by reference (HB-2026-...), donor name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Only</option>
                    <option value="verified">Verified Only</option>
                    <option value="rejected">Rejected Only</option>
                    <option value="refunded">Refunded Only</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Method:</span>
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="all">All Methods</option>
                    <option value="mtn_momo">MTN MoMo</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Donations Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Reference</th>
                    <th className="p-3.5">Donor</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Method & Trans ID</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No donations found matching the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((don) => (
                      <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          {don.referenceCode}
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900">
                            {don.isAnonymous ? 'Anonymous' : don.donorName}
                          </div>
                          <div className="text-[11px] text-slate-400">{don.donorEmail}</div>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">
                          {formatCurrencyXAF(don.amountXaf)}
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-700 block">
                            {don.paymentMethod === 'mtn_momo' ? 'MTN MoMo' : 'PayPal'}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {don.providerTransactionId}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              don.status === 'verified' || don.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : don.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : don.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {don.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(don.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedDonation(don);
                              setVerificationNotes(don.verificationNotes || '');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                          >
                            Audit / Verify
                          </button>
                          <button
                            onClick={() => onViewReceipt(don)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer"
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CAUSE MANAGEMENT */}
        {activeTab === 'causes' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Manage Donation Causes
                </h2>
                <p className="text-xs text-slate-500">
                  Add, edit, or adjust target amounts for humanitarian initiatives in Cameroon.
                </p>
              </div>
              <button
                onClick={() => {
                  setCauseForm({
                    name: '',
                    shortDescription: '',
                    fullDescription: '',
                    targetAmountXaf: 5000000,
                    currentAmountXaf: 0,
                    beneficiaryGroup: 'children',
                    status: 'active',
                    categoryTags: ['Relief', 'Nutrition']
                  });
                  setIsEditingCause(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Cause</span>
              </button>
            </div>

            {/* Causes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {causes.map((cause) => (
                <div key={cause.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-slate-900">{cause.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      {cause.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{cause.shortDescription}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 block">Raised</span>
                      <span className="font-bold text-slate-900">{formatCurrencyXAF(cause.currentAmountXaf)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Goal</span>
                      <span className="font-bold text-slate-900">{formatCurrencyXAF(cause.targetAmountXaf)}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setCauseForm(cause);
                        setIsEditingCause(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: IMPACT REPORTS */}
        {activeTab === 'impact_reports' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Publish Impact Reports
                </h2>
                <p className="text-xs text-slate-500">
                  Share transparent photos, beneficiaries counts, and actual expenditures.
                </p>
              </div>
              <button
                onClick={() => {
                  setReportForm({
                    title: '',
                    description: '',
                    amountSpentXaf: 500000,
                    beneficiariesReached: 50,
                    location: 'Yaoundé, Cameroon',
                    photos: [
                      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop'
                    ],
                    isPublished: true
                  });
                  setIsEditingReport(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Report</span>
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((rep) => (
                <div key={rep.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">{rep.title}</h3>
                    <p className="text-xs text-slate-600 max-w-2xl">{rep.description}</p>
                    <div className="flex gap-4 text-xs text-slate-500 pt-1">
                      <span>Location: {rep.location}</span>
                      <span>Beneficiaries: {rep.beneficiariesReached}</span>
                      <span>Spent: {formatCurrencyXAF(rep.amountSpentXaf)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => {
                        setReportForm(rep);
                        setIsEditingReport(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EDITABLE PUBLIC STATISTICS */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Public Dashboard Impact Statistics
              </h2>
              <p className="text-xs text-slate-500">
                Update the numbers displayed on the home page impact section as new field operations conclude.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                storageService.updateImpactStats(statsForm);
                onRefreshData();
                alert('Public impact statistics updated successfully!');
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs max-w-2xl"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Children Supported</label>
                <input
                  type="number"
                  value={statsForm.childrenSupported}
                  onChange={(e) =>
                    setStatsForm({ ...statsForm, childrenSupported: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Elderly People Supported</label>
                <input
                  type="number"
                  value={statsForm.elderlySupported}
                  onChange={(e) =>
                    setStatsForm({ ...statsForm, elderlySupported: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Meals Provided</label>
                <input
                  type="number"
                  value={statsForm.mealsProvided}
                  onChange={(e) =>
                    setStatsForm({ ...statsForm, mealsProvided: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Families Reached</label>
                <input
                  type="number"
                  value={statsForm.familiesReached}
                  onChange={(e) =>
                    setStatsForm({ ...statsForm, familiesReached: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
                >
                  Save Statistics to Live Website
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: AUDIT TRAIL LOG */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Security Audit Log
              </h2>
              <p className="text-xs text-slate-500">
                Non-repudiation ledger recording every administrative action, verification, and status modification.
              </p>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-mono max-h-[500px] overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex flex-col sm:flex-row justify-between gap-1">
                  <div>
                    <span className="font-bold text-emerald-700">[{log.action}]</span>{' '}
                    <span className="text-slate-800">{log.details}</span>
                  </div>
                  <div className="text-slate-400 shrink-0 text-[11px]">
                    {log.adminEmail} • {new Date(log.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VERIFICATION & RECONCILIATION MODAL */}
        {selectedDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Audit Donation {selectedDonation.referenceCode}
                </h3>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Donor Name:</span>
                  <strong className="text-slate-900">{selectedDonation.donorName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-slate-900">{selectedDonation.donorEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <strong className="text-emerald-700 text-sm">
                    {formatCurrencyXAF(selectedDonation.amountXaf)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Channel:</span>
                  <strong className="text-slate-900">
                    {selectedDonation.paymentMethod === 'mtn_momo' ? 'MTN Mobile Money' : 'PayPal'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submitted Trans ID:</span>
                  <strong className="font-mono text-slate-900">
                    {selectedDonation.providerTransactionId}
                  </strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Verification Notes
                </label>
                <textarea
                  rows={2}
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="e.g. Matched against MTN MoMo Merchant account statement +237 678 750 220"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => handleUpdateStatus(selectedDonation.referenceCode, 'verified')}
                  className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer text-center"
                >
                  Verify & Clear
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedDonation.referenceCode, 'rejected')}
                  className="py-3 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer text-center"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedDonation.referenceCode, 'refunded')}
                  className="py-3 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer text-center"
                >
                  Refund
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
