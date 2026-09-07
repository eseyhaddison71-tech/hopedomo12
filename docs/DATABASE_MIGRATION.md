# HopeBridge Cameroon - Relational Database Migration Guide

This guide describes how to provision, migrate, and inspect the production **PostgreSQL** database for **HopeBridge Cameroon**.

## 1. Prerequisites
- PostgreSQL 14+ or managed Cloud SQL PostgreSQL instance
- `psql` command-line utility or a GUI client (e.g. pgAdmin, DBeaver)

## 2. Schema Architecture
The database schema is located at:
```
/database/schema.sql
```

It provisions 12 relational tables with foreign keys, indexes, and constraints:
1. `users`: Donors and registered accounts with bcrypt hashed passwords.
2. `admins`: Authorized verifiers with role-based access control (`super_admin`, `financial_admin`, `verifier`).
3. `causes`: Donation initiatives (Homeless children, vulnerable elderly, emergency relief).
4. `donations`: Immutable financial records with status (`pending`, `verified`, `completed`, `rejected`, `refunded`).
5. `payment_transactions`: Raw gateway records, X-Reference-Ids, and donor-submitted payment references.
6. `receipts`: Generated official receipts linked to verified donations.
7. `beneficiaries`: Protected registry of community members assisted.
8. `projects`: Field distribution campaigns and budgets.
9. `impact_reports`: Published project outcomes with spent amounts and photos.
10. `notifications`: Email queues and dispatch audit records.
11. `audit_logs`: Non-repudiation administrative action logs.
12. `impact_statistics`: Dynamic dashboard aggregate metrics.

## 3. Running Migrations

### Local / Docker PostgreSQL:
```bash
# Create the database
createdb -h localhost -U postgres hopebridge_db

# Run the complete schema script
psql -h localhost -U postgres -d hopebridge_db -f database/schema.sql
```

### Managed Cloud SQL (GCP):
```bash
gcloud sql connect hopebridge-postgres --user=postgres
\c hopebridge_db
\i database/schema.sql
```

## 4. Verification Queries
To confirm tables and initial seeds were created:
```sql
SELECT count(*) FROM causes; -- Should return 3 initial causes
SELECT count(*) FROM impact_statistics; -- Should return 4 core metrics
SELECT reference_code, amount_xaf, status FROM donations;
```

## 5. Security & Privacy Safeguards
- Raw donor PINs or passwords must **NEVER** be stored or accepted.
- Mobile Money transactions must remain in `pending` status until verified against the official MTN Cameroon portal statement or automated API webhook.
- Audit logs capture admin identity, IP, and timestamp on all status modifications.
