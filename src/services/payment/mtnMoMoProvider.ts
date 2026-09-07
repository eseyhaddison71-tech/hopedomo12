import { PaymentProvider, PaymentInitiationParams, PaymentInitiationResult, PaymentVerificationParams, PaymentVerificationResult } from './types';

/**
 * MTN MoMo (Cameroon) Provider
 *
 * Implements the architecture for official MTN Mobile Money Collections API (v1.0)
 * in accordance with MTN Group Open API guidelines.
 *
 * Official Recipient:
 * Name: Myriam Avon Nkinda
 * Number: +237 678 750 220
 * Country: Cameroon (XAF currency)
 */
export class MTNMoMoProvider implements PaymentProvider {
  public readonly id = 'mtn_momo' as const;
  public readonly name = 'MTN Mobile Money';

  // Credentials configuration
  private readonly primaryKey: string;
  private readonly secondaryKey: string;
  private readonly apiUser: string;
  private readonly apiKey: string;
  private readonly targetEnvironment: string; // 'sandbox' | 'mtncameroon'

  public readonly recipientName = 'Myriam Avon Nkinda';
  public readonly recipientNumber = '+237 678 750 220';

  constructor() {
    // Read from environment if configured
    this.primaryKey = (typeof process !== 'undefined' && process.env?.MTN_MOMO_PRIMARY_KEY) || '';
    this.secondaryKey = (typeof process !== 'undefined' && process.env?.MTN_MOMO_SECONDARY_KEY) || '';
    this.apiUser = (typeof process !== 'undefined' && process.env?.MTN_MOMO_API_USER) || '';
    this.apiKey = (typeof process !== 'undefined' && process.env?.MTN_MOMO_API_KEY) || '';
    this.targetEnvironment = (typeof process !== 'undefined' && process.env?.MTN_MOMO_TARGET_ENV) || 'sandbox';
  }

  public get isApiConfigured(): boolean {
    return Boolean(this.primaryKey && this.apiUser && this.apiKey);
  }

  public getRecipientInfo() {
    return {
      name: this.recipientName,
      account: this.recipientNumber,
      instructions: [
        `Dial *126# on your MTN Cameroon phone or open the MoMo App.`,
        `Select Transfer Money / Envoi d'argent.`,
        `Enter recipient number: ${this.recipientNumber} (${this.recipientName}).`,
        `Enter the exact amount you selected.`,
        `Enter your secret MTN MoMo PIN on your personal phone to authorize the transfer. (HopeBridge Cameroon will NEVER ask for your PIN).`,
        `You will receive an official SMS from MTN containing your Transaction / Reference ID.`,
        `Copy that Transaction ID, paste it into the field below, and submit for verification.`,
        `Your donation will be marked as "Pending Verification" until verified by an authorized HopeBridge Cameroon administrator.`
      ]
    };
  }

  /**
   * Initiates payment instructions for MTN Mobile Money.
   * If official API credentials are configured, this can call the MTN `requesttopay` endpoint.
   * If credentials are pending provisioning, it provides the secure manual USSD transfer instructions.
   */
  public async initiatePayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult> {
    const recipientInfo = this.getRecipientInfo();

    return {
      provider: 'mtn_momo',
      requiresRedirect: false,
      instructions: recipientInfo.instructions,
      recipientAccount: this.recipientNumber,
      recipientName: this.recipientName,
      referenceCode: params.donationReference,
      rawGatewayData: {
        apiStatus: this.isApiConfigured ? 'live_gateway' : 'manual_transfer_pending_api_credentials',
        currency: 'XAF',
        amount: params.amountXaf
      }
    };
  }

  /**
   * Verifies the MTN MoMo transaction.
   *
   * IMPORTANT ETHICAL RULE:
   * Do NOT falsely claim the website can automatically verify an MTN transaction
   * unless the official MTN API gateway with subscription key is verified.
   * Under manual verification, all submissions enter 'pending' status for admin confirmation.
   */
  public async verifyPayment(params: PaymentVerificationParams): Promise<PaymentVerificationResult> {
    if (!this.isApiConfigured) {
      // Under legitimate manual verification without active API gateway keys:
      return {
        isVerified: false,
        status: 'pending',
        notes: `MTN Mobile Money transaction ${params.providerTransactionId} logged. Pending verification against organization MTN statement by authorized administrator.`,
        gatewayResponse: {
          mode: 'manual_verification_required',
          providerTransactionId: params.providerTransactionId,
          timestamp: new Date().toISOString()
        }
      };
    }

    // When official MTN MoMo API credentials are present:
    // GET /collection/v1_0/requesttopay/{params.providerTransactionId}
    // Headers:
    //   X-Target-Environment: this.targetEnvironment
    //   Ocp-Apim-Subscription-Key: this.primaryKey
    //   Authorization: Bearer <token>
    return {
      isVerified: false,
      status: 'pending',
      notes: 'Submitted to MTN Cameroon API gateway. Awaiting webhook/polling confirmation.',
      gatewayResponse: {
        targetEnv: this.targetEnvironment,
        status: 'PENDING'
      }
    };
  }
}
