import { PaymentProvider, PaymentInitiationParams, PaymentInitiationResult, PaymentVerificationParams, PaymentVerificationResult } from './types';

/**
 * PayPal Payment Provider
 *
 * Official Recipient Email: eseyhaddison71@gmail.com
 * Supports official PayPal Order Checkout & secure direct PayPal donation flow.
 *
 * IMPORTANT ETHICAL RULE:
 * Never display a donation as successful simply because the donor clicked the PayPal button.
 * Donations remain in 'pending' status until verified via PayPal API webhook or admin confirmation.
 */
export class PayPalProvider implements PaymentProvider {
  public readonly id = 'paypal' as const;
  public readonly name = 'PayPal';

  public readonly receivingEmail = 'eseyhaddison71@gmail.com';
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly mode: string; // 'sandbox' | 'live'

  constructor() {
    this.clientId = (typeof process !== 'undefined' && process.env?.PAYPAL_CLIENT_ID) || '';
    this.clientSecret = (typeof process !== 'undefined' && process.env?.PAYPAL_CLIENT_SECRET) || '';
    this.mode = (typeof process !== 'undefined' && process.env?.PAYPAL_MODE) || 'sandbox';
  }

  public get isApiConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  public getRecipientInfo() {
    return {
      name: 'HopeBridge Cameroon Fund',
      account: this.receivingEmail,
      instructions: [
        `Click "Donate with PayPal" to open the official PayPal payment portal in a secure window.`,
        `Send the donation directly to verified HopeBridge recipient: ${this.receivingEmail}.`,
        `Include your Donation Reference in the PayPal note or memo: `,
        `Complete the payment inside PayPal's secure platform. Never share your PayPal password with anyone.`,
        `Return to this page and enter your PayPal Transaction ID / Receipt Number below.`,
        `Your donation will be logged with status "Pending Verification" until an administrator verifies the receipt.`
      ]
    };
  }

  /**
   * Generates legitimate PayPal checkout or donation redirection URL.
   * Approx conversion: 1 USD ~ 600 XAF for international donors using PayPal.
   */
  public async initiatePayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult> {
    const usdAmount = Math.max(2, Math.round(params.amountXaf / 600));
    const recipientInfo = this.getRecipientInfo();

    // Construct legitimate PayPal donate / transfer URL with memo and amount
    const memo = encodeURIComponent(`HopeBridge Cameroon Donation: ${params.donationReference} - ${params.causeName}`);
    // PayPal direct transfer/donation link format:
    // https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=eseyhaddison71@gmail.com&item_name=...
    const directPayPalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${encodeURIComponent(
      this.receivingEmail
    )}&item_name=${memo}&currency_code=USD&amount=${usdAmount}`;

    return {
      provider: 'paypal',
      requiresRedirect: true,
      redirectUrl: directPayPalUrl,
      instructions: recipientInfo.instructions,
      recipientAccount: this.receivingEmail,
      recipientName: recipientInfo.name,
      referenceCode: params.donationReference,
      rawGatewayData: {
        usdEstimate: usdAmount,
        currency: 'USD',
        apiMode: this.isApiConfigured ? 'live_sdk' : 'direct_transfer_flow'
      }
    };
  }

  /**
   * Verifies the PayPal transaction.
   * Never marks as verified merely because the button was clicked.
   */
  public async verifyPayment(params: PaymentVerificationParams): Promise<PaymentVerificationResult> {
    if (!this.isApiConfigured) {
      return {
        isVerified: false,
        status: 'pending',
        notes: `PayPal transaction ID ${params.providerTransactionId} submitted by donor. Pending confirmation in HopeBridge PayPal account (${this.receivingEmail}) by administrator.`,
        gatewayResponse: {
          recipientEmail: this.receivingEmail,
          transactionId: params.providerTransactionId,
          timestamp: new Date().toISOString()
        }
      };
    }

    // When PayPal Client ID / Secret are provided:
    // Call GET https://api-m.paypal.com/v2/checkout/orders/{params.providerTransactionId}
    // Check order.status === 'COMPLETED'
    return {
      isVerified: false,
      status: 'pending',
      notes: 'PayPal order submitted for gateway capture validation.',
      gatewayResponse: {
        mode: this.mode,
        status: 'PENDING'
      }
    };
  }
}
