# HopeBridge Cameroon - Local Development Guide

## Overview
HopeBridge Cameroon is built using:
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend Architecture**: Node.js, Express REST API router, Extensible Payment Provider Service Layer
- **Persistence**: Relational schema (PostgreSQL) + Sync Repository
- **Payment Providers**: MTN Mobile Money (Cameroon) & PayPal

## Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Run the Development Server
```bash
npm run dev
```
The application will be accessible at:
```
http://localhost:3000
```

### 3. Testing User Flows

#### Flow A: Donor Journey
1. Navigate to the Home page and inspect causes or impact numbers.
2. Click **Donate Now** on any cause (e.g. *Help Homeless Children*).
3. Select an amount (e.g. 10,000 XAF) and frequency.
4. Fill in your name and email.
5. Choose **MTN Mobile Money** (+237 678 750 220, Myriam Avon Nkinda) or **PayPal** (eseyhaddison71@gmail.com).
6. Enter a transaction reference (e.g., `MTN-TX-99827`).
7. Submit. You will receive a unique donation reference: `HB-2026-00000X`.
8. Notice the status is strictly **Pending Verification** (ethical standard).

#### Flow B: Tracking & Receipt
1. Click **Track Donation** in the navigation.
2. Enter `HB-2026-000001` (pre-seeded verified) or your newly created reference.
3. If verified, click **Download Receipt** to view the print-ready receipt with legal disclaimers.

#### Flow C: Administrator Verification
1. Click **Admin** in the header or footer.
2. Sign in with demo credentials:
   - **Email**: `admin@hopebridge-cameroon.org`
   - **Password**: `HopeBridge2026!`
3. Navigate to **Donation Management**:
   - Inspect pending submissions.
   - Click **Verify**, add internal verification notes (e.g., *"Confirmed in MTN Merchant Statement"*), and confirm.
   - Notice that the cause raised amount and public statistics update dynamically!
   - An audit log entry is recorded with your administrator email.
4. Navigate to **Causes**, **Impact Reports**, and **Dashboard Stats** to edit metrics or publish new humanitarian fieldwork.
