-- HopeBridge Cameroon - Relational Database Schema (PostgreSQL)
-- Mission: Raise and manage donations for homeless children, vulnerable elderly, and emergency relief in Cameroon.
-- Conforms to production security standards: password hashing, foreign keys, constraints, and audit logging.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE (Donors and registered community supporters)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(50),
    country VARCHAR(100) DEFAULT 'Cameroon',
    is_email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. ADMINS TABLE (Authorized staff and verifiers with strict RBAC)
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'verifier' CHECK (role IN ('super_admin', 'financial_admin', 'verifier', 'content_manager')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- 3. CAUSES TABLE (Donation initiatives)
CREATE TABLE IF NOT EXISTS causes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    target_amount_xaf NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    current_amount_xaf NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    image_url VARCHAR(500) NOT NULL,
    beneficiary_group VARCHAR(100) NOT NULL, -- 'children', 'elderly', 'emergency', 'all'
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    category_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_causes_status ON causes(status);
CREATE INDEX IF NOT EXISTS idx_causes_slug ON causes(slug);

-- 4. DONATIONS TABLE (Core ledger of all donation pledges and receipts)
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. HB-2026-000001
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    cause_id UUID REFERENCES causes(id) ON DELETE SET NULL,
    donor_name VARCHAR(150) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(50),
    donor_country VARCHAR(100) DEFAULT 'Cameroon',
    amount_xaf NUMERIC(12, 2) NOT NULL CHECK (amount_xaf > 0),
    amount_usd_est NUMERIC(10, 2),
    frequency VARCHAR(20) NOT NULL DEFAULT 'one_time' CHECK (frequency IN ('one_time', 'monthly')),
    is_anonymous BOOLEAN DEFAULT FALSE,
    donor_message TEXT,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('mtn_momo', 'paypal', 'direct_bank')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'completed', 'rejected', 'refunded')),
    verification_notes TEXT,
    verified_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_donations_reference ON donations(reference_code);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_cause ON donations(cause_id);

-- 5. PAYMENT_TRANSACTIONS TABLE (Raw gateway and manual reference records)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'mtn_momo' or 'paypal'
    provider_transaction_id VARCHAR(255) NOT NULL, -- Customer entered MoMo reference or PayPal Order/Transaction ID
    gateway_reference VARCHAR(255), -- MTN X-Reference-Id or PayPal capture ID
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'XAF',
    recipient_account VARCHAR(100) NOT NULL, -- '+237678750220' or 'eseyhaddison71@gmail.com'
    sender_account VARCHAR(100), -- Sender phone or sender PayPal email
    raw_payload JSONB,
    verification_method VARCHAR(50) DEFAULT 'manual_admin' CHECK (verification_method IN ('manual_admin', 'api_webhook', 'api_polling')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pay_trans_donation ON payment_transactions(donation_id);
CREATE INDEX IF NOT EXISTS idx_pay_trans_provider_id ON payment_transactions(provider_transaction_id);

-- 6. RECEIPTS TABLE (Generated official receipts for verified donations)
CREATE TABLE IF NOT EXISTS receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. RCPT-HB-2026-000001
    donation_id UUID UNIQUE NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    donor_display_name VARCHAR(150) NOT NULL,
    amount_xaf NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'XAF',
    payment_method VARCHAR(50) NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verification_status VARCHAR(50) NOT NULL,
    disclaimer TEXT NOT NULL DEFAULT 'This receipt confirms receipt of humanitarian donation to HopeBridge Cameroon. It does not constitute a tax-deductible receipt under foreign jurisdictions unless verified by local authorities.',
    receipt_data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_receipts_receipt_number ON receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_receipts_donation ON receipts(donation_id);

-- 7. BENEFICIARIES TABLE (Managed registry of community members assisted)
CREATE TABLE IF NOT EXISTS beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL CHECK (category IN ('homeless_child', 'vulnerable_elderly', 'emergency_victim', 'displaced_family')),
    identifier_code VARCHAR(50) UNIQUE NOT NULL, -- E.g. BEN-CHD-0012
    general_location VARCHAR(100) NOT NULL, -- E.g. Yaounde, Douala, Bafoussam
    age_group VARCHAR(50),
    assistance_needed TEXT NOT NULL,
    current_status VARCHAR(50) DEFAULT 'active_support',
    date_registered DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. PROJECTS TABLE (Field distribution and relief campaigns)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cause_id UUID REFERENCES causes(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    budget_xaf NUMERIC(12, 2) NOT NULL,
    spent_xaf NUMERIC(12, 2) DEFAULT 0.00,
    beneficiaries_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('planned', 'in_progress', 'completed')),
    start_date DATE,
    completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. IMPACT_REPORTS TABLE (Public transparency reports with proof of work)
CREATE TABLE IF NOT EXISTS impact_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    cause_id UUID REFERENCES causes(id) ON DELETE SET NULL,
    title VARCHAR(250) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    amount_spent_xaf NUMERIC(12, 2) NOT NULL,
    beneficiaries_reached INTEGER NOT NULL DEFAULT 0,
    location VARCHAR(150) NOT NULL,
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    supporting_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
    published_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_impact_reports_published ON impact_reports(is_published);

-- 10. NOTIFICATIONS TABLE (Email and dispatch queue logs)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('donation_received', 'donation_verified', 'donation_rejected', 'donation_refunded', 'receipt_issued', 'admin_alert')),
    donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. AUDIT_LOGS TABLE (Non-repudiation and verification audit trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- E.g. 'VERIFY_DONATION', 'REJECT_DONATION', 'UPDATE_CAUSE', 'CREATE_IMPACT_REPORT'
    entity_type VARCHAR(50) NOT NULL, -- 'donation', 'cause', 'impact_report', 'statistic'
    entity_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- 12. IMPACT_STATISTICS TABLE (Configurable dashboard summary metrics)
CREATE TABLE IF NOT EXISTS impact_statistics (
    key VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    metric_value INTEGER NOT NULL,
    unit_label VARCHAR(50) NOT NULL,
    last_updated_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED INITIAL IMPACT STATISTICS
INSERT INTO impact_statistics (key, title, metric_value, unit_label) VALUES
('children_supported', 'Children Supported', 142, 'Children'),
('elderly_supported', 'Elderly People Supported', 86, 'Elders'),
('meals_provided', 'Meals Provided', 3450, 'Meals'),
('families_reached', 'Families Reached', 98, 'Families')
ON CONFLICT (key) DO NOTHING;

-- SEED INITIAL CAUSES
INSERT INTO causes (slug, name, short_description, full_description, target_amount_xaf, current_amount_xaf, image_url, beneficiary_group, status, category_tags) VALUES
(
    'homeless-children',
    'Help Homeless Children',
    'Providing warm meals, clean clothing, school supplies, medical checkups, and safe shelter for vulnerable street and displaced children in Cameroon.',
    'Many young boys and girls in urban centers like Douala and Yaoundé endure harsh street conditions without basic nutrition or guidance. HopeBridge Cameroon connects field outreach workers with practical food packages, school enrollment support, and emergency health treatments.',
    5000000.00,
    2150000.00,
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    'children',
    'active',
    ARRAY['Food', 'Clothing', 'Education', 'School supplies', 'Healthcare', 'Temporary shelter']
),
(
    'vulnerable-elderly',
    'Support Vulnerable Elderly People',
    'Ensuring vulnerable elderly men and women receive essential medicines, nutritious groceries, warm blankets, and household care with human dignity.',
    'Senior citizens without family support systems face immense hardship, chronic ailments, and isolation. Our elderly care initiative provides regular home visits, prescription refills, warm clothing, and essential pantry items.',
    4000000.00,
    1820000.00,
    'https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=1200&auto=format&fit=crop',
    'elderly',
    'active',
    ARRAY['Food', 'Medicine', 'Clothing', 'Shelter assistance', 'Household necessities']
),
(
    'emergency-assistance',
    'Emergency Assistance',
    'Rapid response aid supplying emergency food kits, urgent medical triage, crisis relief, and temporary accommodation for displaced individuals.',
    'When crises, severe illness, or extreme weather strike families living in fragile housing, immediate intervention prevents catastrophe. The emergency fund provides rapid-deployment food rations, clinic subsidies, and interim shelter.',
    3000000.00,
    1425000.00,
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200&auto=format&fit=crop',
    'emergency',
    'active',
    ARRAY['Emergency food', 'Medical assistance', 'Temporary accommodation', 'Crisis support']
)
ON CONFLICT (slug) DO NOTHING;
