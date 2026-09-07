import { Donation, DonationReceipt } from '../types';

export function createReceiptFromDonation(donation: Donation): DonationReceipt {
  const isAnonymous = donation.isAnonymous;
  const donorDisplayName = isAnonymous ? 'Anonymous Donor' : donation.donorName;

  return {
    receiptNumber: `RCPT-${donation.referenceCode}`,
    donationReference: donation.referenceCode,
    donorDisplayName,
    donorEmail: isAnonymous ? 'anonymous@hopebridge-cameroon.org' : donation.donorEmail,
    amountXaf: donation.amountXaf,
    currency: 'XAF',
    causeName: donation.causeName,
    paymentMethod: donation.paymentMethod,
    issuedAt: donation.verifiedAt || donation.createdAt,
    verificationStatus: donation.status,
    verificationNotes: donation.verificationNotes,
    disclaimer:
      'Notice: This official receipt confirms receipt of a charitable humanitarian gift to HopeBridge Cameroon. It does not constitute a tax-deductible receipt under foreign jurisdictions unless verified by local statutory authorities. HopeBridge Cameroon appreciates your transparent support in bringing relief to vulnerable communities.'
  };
}

export function formatCurrencyXAF(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0
  }).format(amount).replace('FCFA', 'XAF');
}

export function generatePrintableReceiptHTML(receipt: DonationReceipt): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Donation Receipt - ${receipt.receiptNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; background: #fff; max-width: 750px; margin: 0 auto; }
    .header { border-bottom: 2px solid #059669; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .org-title { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0; }
    .tagline { font-size: 13px; color: #059669; margin-top: 4px; font-style: italic; }
    .receipt-title { font-size: 20px; font-weight: 700; color: #0f172a; text-align: right; }
    .receipt-number { font-size: 13px; color: #64748b; margin-top: 4px; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 8px; }
    .status-verified { background: #dcfce7; color: #15803d; }
    .status-pending { background: #fef3c7; color: #b45309; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 30px 0; }
    .section-title { font-size: 11px; text-transform: uppercase; tracking: 1px; color: #64748b; font-weight: 700; margin-bottom: 6px; }
    .section-val { font-size: 15px; font-weight: 500; color: #0f172a; }
    .amount-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .amount-label { font-size: 13px; color: #64748b; margin-bottom: 4px; }
    .amount-num { font-size: 32px; font-weight: 800; color: #059669; }
    .thank-you { background: #f0fdf4; border-left: 4px solid #059669; padding: 16px 20px; border-radius: 0 8px 8px 0; font-size: 14px; line-height: 1.6; color: #166534; margin: 24px 0; }
    .disclaimer { font-size: 11px; color: #94a3b8; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 30px; }
    .footer-note { font-size: 12px; color: #64748b; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="org-title">HopeBridge Cameroon</h1>
      <div class="tagline">“A little hope can change a life.”</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
        Contact: eseyhaddison71@gmail.com | +237 678 750 220
      </div>
    </div>
    <div style="text-align: right;">
      <div class="receipt-title">DONATION RECEIPT</div>
      <div class="receipt-number">${receipt.receiptNumber}</div>
      <div class="status-badge ${receipt.verificationStatus === 'verified' || receipt.verificationStatus === 'completed' ? 'status-verified' : 'status-pending'}">
        Status: ${receipt.verificationStatus.toUpperCase()}
      </div>
    </div>
  </div>

  <div class="amount-box">
    <div class="amount-label">Donation Amount Received</div>
    <div class="amount-num">${formatCurrencyXAF(receipt.amountXaf)}</div>
  </div>

  <div class="grid">
    <div>
      <div class="section-title">Donor Information</div>
      <div class="section-val">${receipt.donorDisplayName}</div>
      <div style="font-size: 13px; color: #64748b; margin-top: 2px;">${receipt.donorEmail}</div>
    </div>
    <div>
      <div class="section-title">Date & Reference</div>
      <div class="section-val">${new Date(receipt.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
      <div style="font-size: 13px; color: #64748b; margin-top: 2px;">Ref: ${receipt.donationReference}</div>
    </div>
    <div>
      <div class="section-title">Designated Cause</div>
      <div class="section-val">${receipt.causeName}</div>
    </div>
    <div>
      <div class="section-title">Payment Method</div>
      <div class="section-val">${receipt.paymentMethod === 'mtn_momo' ? 'MTN Mobile Money' : receipt.paymentMethod === 'paypal' ? 'PayPal' : 'Direct Transfer'}</div>
    </div>
  </div>

  <div class="thank-you">
    <strong>Together, we can turn compassion into action.</strong><br>
    Your generosity can provide a meal, restore dignity, and give someone another reason to hope in Cameroon. We are profoundly grateful for your partnership.
  </div>

  <div class="disclaimer">
    <strong>Transparency & Legal Notice:</strong> ${receipt.disclaimer}
  </div>

  <div class="footer-note">
    HopeBridge Cameroon &copy; 2026. All rights reserved. Registered Humanitarian Platform.
  </div>
</body>
</html>`;
}
