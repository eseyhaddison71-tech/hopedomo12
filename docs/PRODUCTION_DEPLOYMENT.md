# HopeBridge Cameroon - Production Deployment & Gateway Guide

## 1. Production Build
Run the production build:
```bash
npm run build
```
This produces optimized production static assets in the `/dist` directory.

## 2. Setting Up Official Payment Gateway Credentials

### MTN Mobile Money Cameroon (Open API)
1. Register an organizational developer account on the official MTN Group Open API portal: `https://momodeveloper.mtn.com/`
2. Create an API User and generate your API Key:
   ```bash
   # Create API User (UUID v4)
   curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser \
     -H "X-Reference-Id: <YOUR-UUID>" \
     -H "Ocp-Apim-Subscription-Key: <PRIMARY_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"providerCallbackHost": "your-domain.org"}'
   ```
3. Request production access for Cameroon (MTN Cameroon Momo collections agreement).
4. Set the following environment variables on your server:
   - `MTN_MOMO_PRIMARY_KEY`
   - `MTN_MOMO_SECONDARY_KEY`
   - `MTN_MOMO_API_USER`
   - `MTN_MOMO_API_KEY`
   - `MTN_MOMO_TARGET_ENV="mtncameroon"`

### PayPal Gateway
1. Sign in to the PayPal Developer Dashboard (`https://developer.paypal.com/`).
2. Create an App under **REST API apps**.
3. Retrieve:
   - Client ID (`PAYPAL_CLIENT_ID`)
   - Secret (`PAYPAL_CLIENT_SECRET`)
4. Verify the designated recipient account is: `eseyhaddison71@gmail.com`.
5. Configure Webhooks to listen for:
   - `CHECKOUT.ORDER.APPROVED`
   - `PAYMENT.CAPTURE.COMPLETED`

## 3. Email Delivery (Resend or SMTP)
1. Create an account at `https://resend.com`
2. Verify your custom sending domain (e.g. `hopebridge-cameroon.org`)
3. Add `RESEND_API_KEY` in production environment.

## 4. Security Checklist
- [x] HTTPS enforced on all endpoints
- [x] Strict CORS policy matching production domain
- [x] PostgreSQL connection over SSL (`sslmode=require`)
- [x] No API credentials or donor secrets exposed in client bundles
- [x] Mobile Money PINs are never requested or stored
- [x] Administrator actions recorded in non-repudiation audit logs
- [x] Legal transparency disclaimers visible on all donation receipts
