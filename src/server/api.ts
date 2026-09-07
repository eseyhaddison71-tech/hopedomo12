import express, { Request, Response, Router } from 'express';
import { storageService } from '../services/storage';
import { paymentRegistry } from '../services/payment';
import { createReceiptFromDonation } from '../services/receiptGenerator';

export function createApiRouter(): Router {
  const router = express.Router();
  router.use(express.json());

  // Health check
  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'HopeBridge Cameroon API',
      timestamp: new Date().toISOString()
    });
  });

  // --- CAUSES ---
  router.get('/causes', (_req: Request, res: Response) => {
    res.json(storageService.getCauses());
  });

  router.post('/causes', (req: Request, res: Response) => {
    try {
      const cause = storageService.saveCause(req.body);
      res.status(201).json(cause);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- DONATIONS ---
  router.get('/donations', (req: Request, res: Response) => {
    const { status, email, ref } = req.query;
    if (ref) {
      const donation = storageService.getDonationByReference(String(ref), email ? String(email) : undefined);
      if (!donation) return res.status(404).json({ error: 'Donation not found' });
      return res.json(donation);
    }
    let list = storageService.getDonations();
    if (status) {
      list = list.filter((d) => d.status === status);
    }
    if (email) {
      list = list.filter((d) => d.donorEmail.toLowerCase() === String(email).toLowerCase());
    }
    res.json(list);
  });

  router.post('/donations', (req: Request, res: Response) => {
    try {
      const {
        donorName,
        donorEmail,
        donorPhone,
        donorCountry,
        amountXaf,
        frequency,
        isAnonymous,
        donorMessage,
        causeId,
        causeName,
        paymentMethod,
        providerTransactionId
      } = req.body;

      if (!donorName || !donorEmail || !amountXaf || !causeId || !paymentMethod || !providerTransactionId) {
        return res.status(400).json({ error: 'Missing required donation fields.' });
      }

      const donation = storageService.createDonation({
        donorName,
        donorEmail,
        donorPhone,
        donorCountry: donorCountry || 'Cameroon',
        amountXaf: Number(amountXaf),
        frequency: frequency || 'one_time',
        isAnonymous: Boolean(isAnonymous),
        donorMessage,
        causeId,
        causeName,
        paymentMethod,
        providerTransactionId,
        verificationNotes: 'Submitted for verification.'
      });

      res.status(201).json({
        message: 'Donation received and is currently pending verification.',
        donation
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/donations/:reference', (req: Request, res: Response) => {
    const { reference } = req.params;
    const { email } = req.query;
    const donation = storageService.getDonationByReference(reference, email ? String(email) : undefined);
    if (!donation) {
      return res.status(404).json({ error: 'Donation reference not found' });
    }
    res.json(donation);
  });

  router.patch('/donations/:reference/status', (req: Request, res: Response) => {
    const { reference } = req.params;
    const { status, notes, adminEmail } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = storageService.updateDonationStatus(
      reference,
      status,
      adminEmail || 'admin@hopebridge-cameroon.org',
      notes
    );

    if (!updated) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.json({
      message: `Donation status updated to ${status}`,
      donation: updated
    });
  });

  // --- RECEIPTS ---
  router.get('/receipts/:reference', (req: Request, res: Response) => {
    const { reference } = req.params;
    const donation = storageService.getDonationByReference(reference);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    const receipt = createReceiptFromDonation(donation);
    res.json(receipt);
  });

  // --- IMPACT REPORTS & STATS ---
  router.get('/impact-reports', (_req: Request, res: Response) => {
    res.json(storageService.getImpactReports());
  });

  router.post('/impact-reports', (req: Request, res: Response) => {
    try {
      const report = storageService.saveImpactReport(req.body);
      res.status(201).json(report);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/stats', (_req: Request, res: Response) => {
    res.json(storageService.getImpactStats());
  });

  router.patch('/stats', (req: Request, res: Response) => {
    const updated = storageService.updateImpactStats(req.body);
    res.json(updated);
  });

  // --- AUDIT LOGS ---
  router.get('/audit-logs', (_req: Request, res: Response) => {
    res.json(storageService.getAuditLogs());
  });

  // --- PAYMENT PROVIDER INITIATION ---
  router.post('/payments/initiate', async (req: Request, res: Response) => {
    try {
      const { provider: providerId, params } = req.body;
      const provider = paymentRegistry.getProvider(providerId);
      const result = await provider.initiatePayment(params);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
