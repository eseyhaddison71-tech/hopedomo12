import { PaymentMethodType, DonationStatus } from '../../types';

export interface PaymentInitiationParams {
  donationReference: string;
  amountXaf: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  causeName: string;
  currency?: string;
}

export interface PaymentInitiationResult {
  provider: PaymentMethodType;
  requiresRedirect: boolean;
  redirectUrl?: string;
  instructions: string[];
  recipientAccount: string;
  recipientName: string;
  referenceCode: string;
  rawGatewayData?: Record<string, unknown>;
}

export interface PaymentVerificationParams {
  donationReference: string;
  providerTransactionId: string;
  amountXaf: number;
  donorPhoneOrEmail?: string;
}

export interface PaymentVerificationResult {
  isVerified: boolean;
  status: DonationStatus;
  notes: string;
  gatewayResponse?: Record<string, unknown>;
  verifiedAt?: string;
}

export interface PaymentProvider {
  readonly id: PaymentMethodType;
  readonly name: string;
  readonly isApiConfigured: boolean;
  initiatePayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult>;
  verifyPayment(params: PaymentVerificationParams): Promise<PaymentVerificationResult>;
  getRecipientInfo(): { name: string; account: string; instructions: string[] };
}
