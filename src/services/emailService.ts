import { Donation, DonationReceipt } from '../types';
import { formatCurrencyXAF } from './receiptGenerator';

export type NotificationType =
  | 'donation_received'
  | 'donation_verified'
  | 'donation_rejected'
  | 'donation_refunded'
  | 'receipt_available';

export interface EmailMessage {
  to: string;
  subject: string;
  htmlContent: string;
  notificationType: NotificationType;
  donationReference: string;
}

export class EmailService {
  private resendApiKey: string;
  private fromEmail: string;

  constructor() {
    this.resendApiKey = (typeof process !== 'undefined' && process.env?.RESEND_API_KEY) || '';
    this.fromEmail = (typeof process !== 'undefined' && process.env?.EMAIL_FROM) || 'HopeBridge Cameroon <donations@hopebridge-cameroon.org>';
  }

  public get isConfigured(): boolean {
    return Boolean(this.resendApiKey);
  }

  /**
   * Generates templates and dispatches notification.
   * Logs transparently if API key is in development / simulated mode.
   */
  public async sendNotification(
    type: NotificationType,
    donation: Donation,
    receipt?: DonationReceipt
  ): Promise<{ success: boolean; messageId: string; preview: string }> {
    const donorName = donation.isAnonymous ? 'Kind Supporter' : donation.donorName;
    const formattedAmount = formatCurrencyXAF(donation.amountXaf);

    let subject = '';
    let body = '';

    switch (type) {
      case 'donation_received':
        subject = `[HopeBridge Cameroon] Donation Received: ${donation.referenceCode} (Pending Verification)`;
        body = `
          <p>Dear ${donorName},</p>
          <p>Thank you deeply for initiating a donation of <strong>${formattedAmount}</strong> to support <strong>${donation.causeName}</strong>.</p>
          <p>Your unique donation reference code is: <strong>${donation.referenceCode}</strong></p>
          <p><strong>Status: Pending Verification</strong></p>
          <p>Our team verifies incoming ${donation.paymentMethod === 'mtn_momo' ? 'MTN Mobile Money (+237 678 750 220)' : 'PayPal (eseyhaddison71@gmail.com)'} transactions against official statements. You will receive an update once verified.</p>
          <p>You can track the progress of your donation at any time on our website using your reference code.</p>
        `;
        break;

      case 'donation_verified':
        subject = `[HopeBridge Cameroon] Donation Verified: ${donation.referenceCode}`;
        body = `
          <p>Dear ${donorName},</p>
          <p>We are delighted to confirm that your donation of <strong>${formattedAmount}</strong> has been <strong>successfully verified</strong> by our administration team!</p>
          <p><strong>Reference:</strong> ${donation.referenceCode}<br>
          <strong>Cause:</strong> ${donation.causeName}</p>
          <p>Your generosity helps provide warm meals, medical relief, and shelter to homeless children and vulnerable elderly men and women in Cameroon.</p>
          <p>Your official donation receipt is now ready to download from our website.</p>
        `;
        break;

      case 'donation_rejected':
        subject = `[HopeBridge Cameroon] Verification Update on Donation ${donation.referenceCode}`;
        body = `
          <p>Dear ${donorName},</p>
          <p>We are writing regarding your donation submission <strong>${donation.referenceCode}</strong> for <strong>${formattedAmount}</strong>.</p>
          <p>The transaction reference provided could not be matched against verified statement records. Note: ${donation.verificationNotes || 'Transaction ID did not match account statement'}.</p>
          <p>If you believe this is in error, please reply with your official transaction receipt or contact +237 678 750 220.</p>
        `;
        break;

      case 'donation_refunded':
        subject = `[HopeBridge Cameroon] Refund Processed: ${donation.referenceCode}`;
        body = `
          <p>Dear ${donorName},</p>
          <p>This notification confirms that your donation reference <strong>${donation.referenceCode}</strong> has been marked as refunded.</p>
        `;
        break;

      case 'receipt_available':
        subject = `[HopeBridge Cameroon] Official Donation Receipt: ${receipt?.receiptNumber || donation.referenceCode}`;
        body = `
          <p>Dear ${donorName},</p>
          <p>Enclosed is your official donation receipt for reference <strong>${donation.referenceCode}</strong>.</p>
          <p>Amount: <strong>${formattedAmount}</strong><br>
          Receipt Number: <strong>${receipt?.receiptNumber || 'RCPT-' + donation.referenceCode}</strong></p>
        `;
        break;
    }

    const fullHtml = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0;">HopeBridge Cameroon</h2>
          <span style="font-size: 13px; color: #059669; font-style: italic;">“A little hope can change a life.”</span>
        </div>
        ${body}
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          HopeBridge Cameroon | Email: eseyhaddison71@gmail.com | Phone: +237 678 750 220<br>
          Douala & Yaoundé, Cameroon &copy; 2026
        </div>
      </div>
    `;

    // If Resend API key is present in environment:
    if (this.isConfigured) {
      try {
        // Direct call to Resend API
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.resendApiKey}`
          },
          body: JSON.stringify({
            from: this.fromEmail,
            to: donation.donorEmail,
            subject,
            html: fullHtml
          })
        });
        const data = await response.json();
        return {
          success: response.ok,
          messageId: data.id || `msg-${Date.now()}`,
          preview: subject
        };
      } catch (err) {
        console.warn('Email dispatch failed:', err);
      }
    }

    // Transparent development queue logging:
    const mockMessageId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.info(`[Email Service Dispatch] Type: ${type} | To: ${donation.donorEmail} | Ref: ${donation.referenceCode}`);
    return {
      success: true,
      messageId: mockMessageId,
      preview: subject
    };
  }
}

export const emailService = new EmailService();
