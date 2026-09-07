import { Donation, Cause, ImpactReport, ImpactStats, AuditLog, UserAccount, DonationStatus } from '../types';
import { emailService } from './emailService';
import { createReceiptFromDonation } from './receiptGenerator';

const STORAGE_KEYS = {
  DONATIONS: 'hopebridge_donations_v1',
  CAUSES: 'hopebridge_causes_v1',
  IMPACT_REPORTS: 'hopebridge_impact_reports_v1',
  IMPACT_STATS: 'hopebridge_impact_stats_v1',
  AUDIT_LOGS: 'hopebridge_audit_logs_v1',
  USERS: 'hopebridge_users_v1',
  CURRENT_ADMIN: 'hopebridge_current_admin_v1',
  CURRENT_DONOR: 'hopebridge_current_donor_v1'
};

// Initial Seed Causes
const DEFAULT_CAUSES: Cause[] = [
  {
    id: 'cause-1',
    slug: 'homeless-children',
    name: 'Help Homeless Children',
    shortDescription:
      'Providing food, clean clothing, education, school supplies, healthcare, and safe temporary shelter for homeless and orphaned youth in Cameroon.',
    fullDescription:
      'Hundreds of children sleep on the streets of Cameroon’s urban centers without nutrition, basic security, or education. HopeBridge Cameroon deploys ground relief to provide balanced nutrition packages, school fee assistance, school supplies, and medical clinic checkups to help children regain safety and a future.',
    targetAmountXaf: 5000000,
    currentAmountXaf: 2850000,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    beneficiaryGroup: 'children',
    status: 'active',
    categoryTags: ['Food', 'Clothing', 'Education', 'School supplies', 'Healthcare', 'Temporary shelter'],
    startDate: '2026-01-01'
  },
  {
    id: 'cause-2',
    slug: 'vulnerable-elderly',
    name: 'Support Vulnerable Elderly People',
    shortDescription:
      'Supplying life-saving medicines, nutritious groceries, warm blankets, shelter assistance, and household care for neglected senior citizens.',
    fullDescription:
      'Elderly men and women without kin or pensions in Cameroon face severe isolation, untreated hypertension, diabetes, and cold nights. Our volunteer healthcare liaisons deliver monthly pantry parcels, prescription refills, warm blankets, and home visits to restore their dignity.',
    targetAmountXaf: 4000000,
    currentAmountXaf: 2120000,
    imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=1200&auto=format&fit=crop',
    beneficiaryGroup: 'elderly',
    status: 'active',
    categoryTags: ['Food', 'Medicine', 'Clothing', 'Shelter assistance', 'Basic household necessities'],
    startDate: '2026-01-01'
  },
  {
    id: 'cause-3',
    slug: 'emergency-assistance',
    name: 'Emergency Assistance',
    shortDescription:
      'Providing rapid emergency food kits, urgent clinic fees, crisis support, and temporary accommodation for displaced individuals and families in distress.',
    fullDescription:
      'When families face sudden fires, eviction, acute illnesses, or displacement, minutes matter. The HopeBridge Emergency Relief Fund mobilizes rapid grants to pay urgent clinic admissions, distribute dry rations, and provide emergency accommodation.',
    targetAmountXaf: 3000000,
    currentAmountXaf: 1650000,
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200&auto=format&fit=crop',
    beneficiaryGroup: 'emergency',
    status: 'active',
    categoryTags: ['Emergency food', 'Medical assistance', 'Temporary accommodation', 'Crisis support'],
    startDate: '2026-01-01'
  }
];

// Initial Seed Statistics
const DEFAULT_STATS: ImpactStats = {
  childrenSupported: 142,
  elderlySupported: 86,
  mealsProvided: 3450,
  familiesReached: 98,
  lastUpdated: new Date().toISOString()
};

// Initial Seed Impact Reports
const DEFAULT_IMPACT_REPORTS: ImpactReport[] = [
  {
    id: 'rep-1',
    title: 'Yaoundé Street Children School Resumption & Nutrition Drive',
    slug: 'yaounde-school-resumption',
    description:
      'Distributed 45 complete backpack sets containing notebooks, pens, mathematics sets, and uniforms to formerly street-dwelling children now reintegrated into local primary schools in Yaoundé. In addition, 2 weeks of nutritious dry rations were provided.',
    amountSpentXaf: 650000,
    beneficiariesReached: 45,
    location: 'Yaoundé (Mokolo & Biyem-Assi districts), Cameroon',
    reportDate: '2026-02-15',
    photos: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop'
    ],
    causeId: 'cause-1',
    causeName: 'Help Homeless Children',
    isPublished: true
  },
  {
    id: 'rep-2',
    title: 'Elderly Winter Blanket & Essential Medication Outreach',
    slug: 'elderly-blanket-medication',
    description:
      'Delivered vital hypertension and arthritis medication packages along with heavy woolen blankets and 25kg bags of rice to 38 isolated senior citizens in Douala and surrounding peri-urban communities.',
    amountSpentXaf: 580000,
    beneficiariesReached: 38,
    location: 'Douala (Ndogpassi & Bonabéri), Cameroon',
    reportDate: '2026-01-28',
    photos: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1000&auto=format&fit=crop'
    ],
    causeId: 'cause-2',
    causeName: 'Support Vulnerable Elderly People',
    isPublished: true
  }
];

// Seed Verified & Pending Donations
const DEFAULT_DONATIONS: Donation[] = [
  {
    id: 'don-001',
    referenceCode: 'HB-2026-000001',
    donorName: 'Ebenezer T.',
    donorEmail: 'ebenezer.t@gmail.com',
    donorPhone: '+237 670 112 344',
    donorCountry: 'Cameroon',
    amountXaf: 25000,
    frequency: 'one_time',
    isAnonymous: false,
    donorMessage: 'Praying this brings warmth and food to the children.',
    causeId: 'cause-1',
    causeName: 'Help Homeless Children',
    paymentMethod: 'mtn_momo',
    providerTransactionId: 'MTN-CI88920119',
    status: 'verified',
    verificationNotes: 'Verified against MTN MoMo statement +237 678 750 220. Ref matched.',
    verifiedBy: 'Myriam Avon Nkinda (Admin)',
    verifiedAt: '2026-02-10T11:20:00Z',
    createdAt: '2026-02-10T09:14:00Z',
    updatedAt: '2026-02-10T11:20:00Z'
  },
  {
    id: 'don-002',
    referenceCode: 'HB-2026-000002',
    donorName: 'Marie Claire',
    donorEmail: 'marie.c@bluewin.ch',
    donorPhone: '+41 79 320 11 02',
    donorCountry: 'Switzerland',
    amountXaf: 50000,
    amountUsdEst: 83,
    frequency: 'monthly',
    isAnonymous: false,
    donorMessage: 'For elderly medical prescriptions. God bless your team.',
    causeId: 'cause-2',
    causeName: 'Support Vulnerable Elderly People',
    paymentMethod: 'paypal',
    providerTransactionId: 'PP-9RT88201',
    status: 'verified',
    verificationNotes: 'Verified in HopeBridge PayPal (eseyhaddison71@gmail.com).',
    verifiedBy: 'HopeBridge SuperAdmin',
    verifiedAt: '2026-02-14T14:40:00Z',
    createdAt: '2026-02-14T13:30:00Z',
    updatedAt: '2026-02-14T14:40:00Z'
  },
  {
    id: 'don-003',
    referenceCode: 'HB-2026-000003',
    donorName: 'Anonymous Donor',
    donorEmail: 'supporter@community.cm',
    donorCountry: 'Cameroon',
    amountXaf: 10000,
    frequency: 'one_time',
    isAnonymous: true,
    causeId: 'cause-3',
    causeName: 'Emergency Assistance',
    paymentMethod: 'mtn_momo',
    providerTransactionId: 'TX-20260228-091',
    status: 'pending',
    verificationNotes: 'Pending bank / MoMo statement reconciliations.',
    createdAt: '2026-03-01T08:15:00Z',
    updatedAt: '2026-03-01T08:15:00Z'
  }
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminEmail: 'admin@hopebridge-cameroon.org',
    action: 'SYSTEM_INITIALIZATION',
    entityType: 'auth',
    entityId: 'SYSTEM',
    details: 'Initialized HopeBridge Cameroon database ledger and causes.',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'log-2',
    adminEmail: 'admin@hopebridge-cameroon.org',
    action: 'VERIFY_DONATION',
    entityType: 'donation',
    entityId: 'HB-2026-000001',
    details: 'Verified MTN Mobile Money receipt of 25,000 XAF from Ebenezer T.',
    createdAt: '2026-02-10T11:20:00Z'
  },
  {
    id: 'log-3',
    adminEmail: 'admin@hopebridge-cameroon.org',
    action: 'VERIFY_DONATION',
    entityType: 'donation',
    entityId: 'HB-2026-000002',
    details: 'Verified PayPal donation of 50,000 XAF ($83 USD) from Marie Claire.',
    createdAt: '2026-02-14T14:40:00Z'
  }
];

export class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Storage write error:', err);
    }
  }

  // --- DONATIONS ---
  public getDonations(): Donation[] {
    return this.get<Donation[]>(STORAGE_KEYS.DONATIONS, DEFAULT_DONATIONS);
  }

  public getDonationByReference(ref: string, email?: string): Donation | null {
    const cleanRef = ref.trim().toUpperCase();
    const donations = this.getDonations();
    const found = donations.find((d) => d.referenceCode.toUpperCase() === cleanRef);
    if (!found) return null;

    if (email && email.trim()) {
      if (found.donorEmail.toLowerCase() !== email.trim().toLowerCase()) {
        return null;
      }
    }
    return found;
  }

  public getDonationsByEmail(email: string): Donation[] {
    const cleanEmail = email.trim().toLowerCase();
    return this.getDonations().filter((d) => d.donorEmail.toLowerCase() === cleanEmail);
  }

  public createDonation(data: Omit<Donation, 'id' | 'referenceCode' | 'createdAt' | 'updatedAt' | 'status'>): Donation {
    const donations = this.getDonations();
    const count = donations.length + 1;
    const refNumber = String(count).padStart(6, '0');
    const referenceCode = `HB-2026-${refNumber}`;

    const newDonation: Donation = {
      ...data,
      id: `don-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      referenceCode,
      status: 'pending', // Strictly pending! Never verified automatically.
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    donations.unshift(newDonation);
    this.set(STORAGE_KEYS.DONATIONS, donations);

    // Queue donation received notification email
    emailService.sendNotification('donation_received', newDonation);

    // Record audit log
    this.addAuditLog(
      'DONOR_SUBMITTED',
      'donation',
      referenceCode,
      `Submitted ${newDonation.amountXaf} XAF donation via ${newDonation.paymentMethod}. Status: Pending verification.`
    );

    return newDonation;
  }

  public updateDonationStatus(
    referenceCode: string,
    newStatus: DonationStatus,
    adminEmail: string,
    verificationNotes?: string
  ): Donation | null {
    const donations = this.getDonations();
    const index = donations.findIndex((d) => d.referenceCode === referenceCode);
    if (index === -1) return null;

    const current = donations[index];
    const previousStatus = current.status;

    current.status = newStatus;
    current.updatedAt = new Date().toISOString();
    if (verificationNotes !== undefined) {
      current.verificationNotes = verificationNotes;
    }

    if (newStatus === 'verified' || newStatus === 'completed') {
      current.verifiedBy = adminEmail;
      current.verifiedAt = new Date().toISOString();

      // If becoming verified, increment cause amount raised
      if (previousStatus !== 'verified' && previousStatus !== 'completed') {
        this.incrementCauseRaised(current.causeId, current.amountXaf);
      }

      // Send verified email & receipt
      const receipt = createReceiptFromDonation(current);
      emailService.sendNotification('donation_verified', current, receipt);
      emailService.sendNotification('receipt_available', current, receipt);
    } else if (newStatus === 'rejected') {
      emailService.sendNotification('donation_rejected', current);
    } else if (newStatus === 'refunded') {
      emailService.sendNotification('donation_refunded', current);
      // If was previously verified, decrease cause raised
      if (previousStatus === 'verified' || previousStatus === 'completed') {
        this.incrementCauseRaised(current.causeId, -current.amountXaf);
      }
    }

    donations[index] = current;
    this.set(STORAGE_KEYS.DONATIONS, donations);

    this.addAuditLog(
      `DONATION_STATUS_${newStatus.toUpperCase()}`,
      'donation',
      referenceCode,
      `Changed status from ${previousStatus} to ${newStatus}. Notes: ${verificationNotes || 'None'}`
    );

    return current;
  }

  // --- CAUSES ---
  public getCauses(): Cause[] {
    return this.get<Cause[]>(STORAGE_KEYS.CAUSES, DEFAULT_CAUSES);
  }

  public getCauseById(id: string): Cause | undefined {
    return this.getCauses().find((c) => c.id === id || c.slug === id);
  }

  public saveCause(causeData: Partial<Cause> & { name: string; targetAmountXaf: number }): Cause {
    const causes = this.getCauses();
    if (causeData.id) {
      const index = causes.findIndex((c) => c.id === causeData.id);
      if (index !== -1) {
        causes[index] = { ...causes[index], ...causeData };
        this.set(STORAGE_KEYS.CAUSES, causes);
        this.addAuditLog('UPDATE_CAUSE', 'cause', causes[index].name, `Updated cause details`);
        return causes[index];
      }
    }

    const newCause: Cause = {
      id: `cause-${Date.now()}`,
      slug: causeData.slug || causeData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: causeData.name,
      shortDescription: causeData.shortDescription || '',
      fullDescription: causeData.fullDescription || '',
      targetAmountXaf: causeData.targetAmountXaf,
      currentAmountXaf: causeData.currentAmountXaf || 0,
      imageUrl:
        causeData.imageUrl ||
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
      beneficiaryGroup: causeData.beneficiaryGroup || 'all',
      status: causeData.status || 'active',
      categoryTags: causeData.categoryTags || ['Relief', 'Humanitarian'],
      startDate: causeData.startDate || new Date().toISOString().split('T')[0]
    };

    causes.push(newCause);
    this.set(STORAGE_KEYS.CAUSES, causes);
    this.addAuditLog('CREATE_CAUSE', 'cause', newCause.name, `Created new cause`);
    return newCause;
  }

  public deleteCause(causeId: string): boolean {
    let causes = this.getCauses();
    const cause = causes.find((c) => c.id === causeId);
    if (!cause) return false;
    causes = causes.filter((c) => c.id !== causeId);
    this.set(STORAGE_KEYS.CAUSES, causes);
    this.addAuditLog('DELETE_CAUSE', 'cause', cause.name, `Deleted cause`);
    return true;
  }

  private incrementCauseRaised(causeId: string, deltaXaf: number): void {
    const causes = this.getCauses();
    const idx = causes.findIndex((c) => c.id === causeId || c.slug === causeId);
    if (idx !== -1) {
      causes[idx].currentAmountXaf = Math.max(0, causes[idx].currentAmountXaf + deltaXaf);
      this.set(STORAGE_KEYS.CAUSES, causes);
    }
  }

  // --- IMPACT REPORTS ---
  public getImpactReports(): ImpactReport[] {
    return this.get<ImpactReport[]>(STORAGE_KEYS.IMPACT_REPORTS, DEFAULT_IMPACT_REPORTS);
  }

  public saveImpactReport(reportData: Partial<ImpactReport> & { title: string; amountSpentXaf: number }): ImpactReport {
    const reports = this.getImpactReports();
    if (reportData.id) {
      const idx = reports.findIndex((r) => r.id === reportData.id);
      if (idx !== -1) {
        reports[idx] = { ...reports[idx], ...reportData };
        this.set(STORAGE_KEYS.IMPACT_REPORTS, reports);
        this.addAuditLog('UPDATE_IMPACT_REPORT', 'impact_report', reports[idx].title, 'Updated impact report');
        return reports[idx];
      }
    }

    const newReport: ImpactReport = {
      id: `rep-${Date.now()}`,
      title: reportData.title,
      slug: reportData.slug || reportData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: reportData.description || '',
      amountSpentXaf: reportData.amountSpentXaf,
      beneficiariesReached: reportData.beneficiariesReached || 0,
      location: reportData.location || 'Cameroon',
      reportDate: reportData.reportDate || new Date().toISOString().split('T')[0],
      photos: reportData.photos?.length ? reportData.photos : [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop'
      ],
      supportingDocuments: reportData.supportingDocuments || [],
      causeId: reportData.causeId,
      causeName: reportData.causeName,
      isPublished: reportData.isPublished ?? true
    };

    reports.unshift(newReport);
    this.set(STORAGE_KEYS.IMPACT_REPORTS, reports);
    this.addAuditLog('CREATE_IMPACT_REPORT', 'impact_report', newReport.title, 'Published impact report');
    return newReport;
  }

  public deleteImpactReport(reportId: string): boolean {
    let reports = this.getImpactReports();
    const target = reports.find((r) => r.id === reportId);
    if (!target) return false;
    reports = reports.filter((r) => r.id !== reportId);
    this.set(STORAGE_KEYS.IMPACT_REPORTS, reports);
    this.addAuditLog('DELETE_IMPACT_REPORT', 'impact_report', target.title, 'Deleted report');
    return true;
  }

  // --- IMPACT STATISTICS ---
  public getImpactStats(): ImpactStats {
    return this.get<ImpactStats>(STORAGE_KEYS.IMPACT_STATS, DEFAULT_STATS);
  }

  public updateImpactStats(newStats: Partial<ImpactStats>): ImpactStats {
    const current = this.getImpactStats();
    const updated: ImpactStats = {
      ...current,
      ...newStats,
      lastUpdated: new Date().toISOString()
    };
    this.set(STORAGE_KEYS.IMPACT_STATS, updated);
    this.addAuditLog('UPDATE_STATISTICS', 'statistic', 'Impact Dashboard', 'Updated public impact statistics');
    return updated;
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    return this.get<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
  }

  public addAuditLog(
    action: string,
    entityType: 'donation' | 'cause' | 'impact_report' | 'statistic' | 'auth',
    entityId: string,
    details: string,
    adminEmail?: string
  ): void {
    const currentAdmin = this.getCurrentAdmin();
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminEmail: adminEmail || currentAdmin?.email || 'admin@hopebridge-cameroon.org',
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString()
    };
    logs.unshift(newLog);
    // Keep last 150 logs
    if (logs.length > 150) logs.length = 150;
    this.set(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // --- AUTHENTICATION ---
  public getCurrentAdmin(): UserAccount | null {
    return this.get<UserAccount | null>(STORAGE_KEYS.CURRENT_ADMIN, null);
  }

  public setCurrentAdmin(admin: UserAccount | null): void {
    this.set(STORAGE_KEYS.CURRENT_ADMIN, admin);
  }

  public getCurrentDonor(): UserAccount | null {
    return this.get<UserAccount | null>(STORAGE_KEYS.CURRENT_DONOR, null);
  }

  public getCurrentUser(): UserAccount | null {
    return this.getCurrentDonor();
  }

  public setCurrentDonor(donor: UserAccount | null): void {
    this.set(STORAGE_KEYS.CURRENT_DONOR, donor);
  }

  public setCurrentUser(user: UserAccount | null): void {
    this.setCurrentDonor(user);
  }

  public registerDonor(fullName: string, email: string, password: string, country: string, phone?: string): UserAccount {
    const users = this.get<UserAccount[]>(STORAGE_KEYS.USERS, []);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName,
      country: country || 'Cameroon',
      phoneNumber: phone,
      role: 'donor',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.set(STORAGE_KEYS.USERS, users);
    this.setCurrentDonor(newUser);
    return newUser;
  }

  public loginDonor(email: string): UserAccount | null {
    const users = this.get<UserAccount[]>(STORAGE_KEYS.USERS, []);
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (user) {
      this.setCurrentDonor(user);
      return user;
    }
    return null;
  }
}

export const storageService = new StorageService();
