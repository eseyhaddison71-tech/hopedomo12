export type DonationStatus = 'pending' | 'verified' | 'completed' | 'rejected' | 'refunded';
export type PaymentMethodType = 'mtn_momo' | 'paypal' | 'direct_bank';
export type DonationFrequency = 'one_time' | 'monthly';
export type BeneficiaryGroup = 'children' | 'elderly' | 'emergency' | 'all';

export interface Donation {
  id: string;
  referenceCode: string; // e.g., HB-2026-000001
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorCountry: string;
  amountXaf: number;
  amountUsdEst?: number;
  frequency: DonationFrequency;
  isAnonymous: boolean;
  donorMessage?: string;
  causeId: string;
  causeName: string;
  paymentMethod: PaymentMethodType;
  providerTransactionId: string; // e.g. MTN MoMo transaction reference or PayPal confirmation
  status: DonationStatus;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cause {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  targetAmountXaf: number;
  currentAmountXaf: number;
  imageUrl: string;
  beneficiaryGroup: BeneficiaryGroup;
  status: 'active' | 'completed' | 'paused';
  categoryTags: string[];
  startDate: string;
  endDate?: string;
}

export interface ImpactReport {
  id: string;
  title: string;
  slug: string;
  description: string;
  amountSpentXaf: number;
  beneficiariesReached: number;
  location: string;
  reportDate: string;
  photos: string[];
  supportingDocuments?: string[];
  causeId?: string;
  causeName?: string;
  isPublished: boolean;
}

export interface ImpactStats {
  childrenSupported: number;
  elderlySupported: number;
  mealsProvided: number;
  familiesReached: number;
  lastUpdated: string;
}

export interface DonationReceipt {
  receiptNumber: string; // RCPT-HB-2026-000001
  donationReference: string;
  donorDisplayName: string;
  donorEmail: string;
  amountXaf: number;
  currency: string;
  causeName: string;
  paymentMethod: PaymentMethodType;
  issuedAt: string;
  verificationStatus: DonationStatus;
  disclaimer: string;
  verificationNotes?: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  entityType: 'donation' | 'cause' | 'impact_report' | 'statistic' | 'auth';
  entityId: string;
  details: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  country: string;
  role: 'donor' | 'admin';
  createdAt: string;
}

export interface DonationFilter {
  status?: string;
  paymentMethod?: string;
  searchQuery?: string;
  causeId?: string;
}
