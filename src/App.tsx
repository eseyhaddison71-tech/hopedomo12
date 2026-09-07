import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ImpactStats } from './components/ImpactStats';
import { CausesSection } from './components/CausesSection';
import { DonationModal } from './components/DonationModal';
import { DonationTracker } from './components/DonationTracker';
import { ReceiptModal } from './components/ReceiptModal';
import { TransparencyView } from './components/TransparencyView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { DonorPortal } from './components/DonorPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';

import { storageService } from './services/storage';
import { Cause, Donation, ImpactReport, ImpactStats as ImpactStatsType, UserAccount } from './types';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<
    'home' | 'causes' | 'transparency' | 'track' | 'about' | 'contact' | 'donor' | 'admin'
  >('home');

  // Application Data State
  const [causes, setCauses] = useState<Cause[]>([]);
  const [impactReports, setImpactReports] = useState<ImpactReport[]>([]);
  const [impactStats, setImpactStats] = useState<ImpactStatsType>(storageService.getImpactStats());

  // User & Admin Auth State
  const [currentDonor, setCurrentDonor] = useState<UserAccount | null>(storageService.getCurrentUser());
  const [currentAdmin, setCurrentAdmin] = useState<UserAccount | null>(storageService.getCurrentAdmin());

  // Modal State
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationInitialCauseId, setDonationInitialCauseId] = useState<string | undefined>(undefined);

  const [receiptDonation, setReceiptDonation] = useState<Donation | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'donation' | 'refund'>('privacy');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  const [trackInitialReference, setTrackInitialReference] = useState<string>('');

  // Load initial data
  const refreshData = () => {
    setCauses(storageService.getCauses());
    setImpactReports(storageService.getImpactReports());
    setImpactStats(storageService.getImpactStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers
  const handleOpenDonate = (causeId?: string) => {
    setDonationInitialCauseId(causeId);
    setIsDonationModalOpen(true);
  };

  const handleDonationSuccess = (donation: Donation) => {
    refreshData();
  };

  const handleViewReceipt = (donation: Donation) => {
    setReceiptDonation(donation);
    setIsReceiptModalOpen(true);
  };

  const handleOpenLegal = (tab: 'privacy' | 'terms' | 'donation' | 'refund') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  const handleNavigate = (view: 'home' | 'causes' | 'transparency' | 'track' | 'about' | 'contact' | 'donor' | 'admin') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Universal Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenDonateModal={() => handleOpenDonate()}
        currentDonor={currentDonor}
        currentAdmin={currentAdmin}
        onAdminLogout={() => {
          storageService.setCurrentAdmin(null);
          setCurrentAdmin(null);
        }}
        onDonorLogout={() => {
          storageService.setCurrentUser(null);
          setCurrentDonor(null);
        }}
      />

      {/* Main Content Render */}
      <main className="flex-grow">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <div>
            <Hero
              onDonateClick={() => handleOpenDonate()}
              onExploreCausesClick={() => handleNavigate('causes')}
              onTrackClick={() => handleNavigate('track')}
            />

            <ImpactStats stats={impactStats} />

            <CausesSection
              causes={causes}
              onDonateToCause={(causeId) => handleOpenDonate(causeId)}
            />

            {/* Quick Transparency Preview on Home */}
            <section className="py-16 sm:py-20 bg-white border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 max-w-xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                      Zero Tolerance for Misappropriation
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                      Where Does Every Franc Go?
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      We document our fieldwork in Cameroon with photographs, merchant MoMo statements, and verified impact reports. 94% of our donations directly fund meals, medicine, and shelter.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <button
                      onClick={() => handleNavigate('transparency')}
                      className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer text-center"
                    >
                      View Financial Allocation & Reports
                    </button>
                    <button
                      onClick={() => handleOpenDonate()}
                      className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer text-center"
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: CAUSES */}
        {currentView === 'causes' && (
          <div>
            <div className="bg-slate-900 text-white py-14 px-4 text-center">
              <div className="max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                  Direct Field Initiatives
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit',sans-serif]">
                  Support Our Humanitarian Causes
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Select a specific cause below to ensure your donation delivers targeted food, medicine, and shelter in Cameroon.
                </p>
              </div>
            </div>
            <CausesSection
              causes={causes}
              onDonateToCause={(causeId) => handleOpenDonate(causeId)}
            />
          </div>
        )}

        {/* VIEW 3: TRANSPARENCY & IMPACT */}
        {currentView === 'transparency' && (
          <TransparencyView
            impactReports={impactReports}
            onDonateClick={() => handleOpenDonate()}
          />
        )}

        {/* VIEW 4: TRACK DONATION */}
        {currentView === 'track' && (
          <DonationTracker
            initialReference={trackInitialReference}
            onViewReceipt={handleViewReceipt}
            onDonateClick={() => handleOpenDonate()}
          />
        )}

        {/* VIEW 5: ABOUT US */}
        {currentView === 'about' && (
          <AboutView
            onDonateClick={() => handleOpenDonate()}
            onContactClick={() => handleNavigate('contact')}
          />
        )}

        {/* VIEW 6: CONTACT & FAQ */}
        {currentView === 'contact' && (
          <ContactView onDonateClick={() => handleOpenDonate()} />
        )}

        {/* VIEW 7: DONOR PORTAL */}
        {currentView === 'donor' && (
          <DonorPortal
            currentDonor={currentDonor}
            onLogin={(user) => {
              setCurrentDonor(user);
              storageService.setCurrentUser(user);
            }}
            onLogout={() => {
              setCurrentDonor(null);
              storageService.setCurrentUser(null);
            }}
            onViewReceipt={handleViewReceipt}
            onOpenDonate={() => handleOpenDonate()}
          />
        )}

        {/* VIEW 8: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            currentAdmin={currentAdmin}
            onLogin={(admin) => {
              setCurrentAdmin(admin);
              storageService.setCurrentAdmin(admin);
            }}
            onLogout={() => {
              setCurrentAdmin(null);
              storageService.setCurrentAdmin(null);
            }}
            onViewReceipt={handleViewReceipt}
            causes={causes}
            onRefreshData={refreshData}
          />
        )}
      </main>

      {/* Main Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLegal={handleOpenLegal}
        onOpenDonate={() => handleOpenDonate()}
      />

      {/* MODALS */}
      {/* 1. Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        causes={causes}
        initialCauseId={donationInitialCauseId}
        onDonationSuccess={handleDonationSuccess}
      />

      {/* 2. Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        donation={receiptDonation}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      {/* 3. Legal & Transparency Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </div>
  );
}
