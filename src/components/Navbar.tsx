import React, { useState } from 'react';
import { Heart, Search, Menu, X, ShieldCheck, User, HandHeart, FileText } from 'lucide-react';
import { UserAccount } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDonate: (causeId?: string) => void;
  onOpenTracker: () => void;
  currentAdmin: UserAccount | null;
  onOpenAdmin: () => void;
  onOpenDonorPortal: () => void;
  currentDonor: UserAccount | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDonate,
  onOpenTracker,
  currentAdmin,
  onOpenAdmin,
  onOpenDonorPortal,
  currentDonor
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'causes', label: 'Causes' },
    { id: 'transparency', label: 'Where Your Donation Goes' },
    { id: 'impact-reports', label: 'Impact Reports' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact & FAQ' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar for Cameroon solidarity & verification notice */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-100">HopeBridge Cameroon</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300 italic">“A little hope can change a life.”</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenTracker}
              id="nav-track-donation-top"
              className="hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Donation</span>
            </button>
            <span className="text-slate-600">|</span>
            {currentAdmin ? (
              <button
                onClick={onOpenAdmin}
                id="nav-admin-badge"
                className="text-amber-400 font-semibold hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdmin}
                id="nav-admin-login-link"
                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Staff Login
              </button>
            )}
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenDonorPortal}
              id="nav-donor-portal-link"
              className="hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentDonor ? currentDonor.fullName.split(' ')[0] : 'My Account'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo-button"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                HopeBridge <span className="text-emerald-600">Cameroon</span>
              </span>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest -mt-1 hidden sm:block">
                Humanitarian Relief & Care
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenTracker}
              id="header-track-btn"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Verify Status</span>
            </button>

            <button
              onClick={() => onOpenDonate()}
              id="header-donate-btn"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <HandHeart className="w-4 h-4 text-emerald-100" />
              <span>Donate Now</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenDonate()}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold sm:hidden flex items-center gap-1.5"
            >
              <HandHeart className="w-3.5 h-3.5" />
              <span>Donate</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              aria-label="Toggle Navigation Menu"
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activeTab === link.id
                    ? 'text-emerald-700 bg-emerald-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Track Donation by Reference</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-base shadow-md shadow-emerald-600/20"
            >
              <HandHeart className="w-5 h-5" />
              <span>Donate Now</span>
            </button>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDonorPortal();
                }}
                className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>{currentDonor ? 'My Donations' : 'Donor Login'}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
