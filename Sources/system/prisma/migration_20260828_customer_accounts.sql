-- ═══════════════════════════════════════════════════════════════════════════
-- Migration: customer_accounts (tài khoản khách hàng công khai, tách biệt users)
-- Ngày: 2026-08-28
-- Áp dụng thủ công qua script Node (KHÔNG dùng prisma migrate dev/deploy —
-- xem CLAUDE.md mục Hạ tầng: lỗi engine với multiSchema trên DB này).
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Bảng tài khoản khách hàng mới
CREATE TABLE IF NOT EXISTS webdrop.customer_accounts (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    phone       TEXT UNIQUE,
    password    TEXT NOT NULL,
    avatar_url  TEXT,
    customer_id INTEGER UNIQUE REFERENCES webdrop.customers(id),
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 2. Backfill: chuyển 2 tài khoản CV hiện có (users.id 3 và 5) sang customer_accounts,
--    copy nguyên password hash (định dạng scryptSync salt:hash — không cần reset mật khẩu).
--    User id=5 có Customer khớp email (customer id=4, có sẵn SĐT) — gắn customer_id luôn.
--    User id=3 (tài khoản test, không có Customer/SĐT khớp) — customer_id và phone để NULL.
INSERT INTO webdrop.customer_accounts (name, email, phone, password, customer_id, created_at)
SELECT u.name, u.email, c.phone, u.password, c.id, u.created_at
FROM webdrop.users u
LEFT JOIN webdrop.customers c ON c.email = u.email
WHERE u.id IN (3, 5);

-- 3. cv_profiles: thêm account_id, backfill theo email khớp, rồi bỏ user_id cũ
ALTER TABLE webdrop.cv_profiles ADD COLUMN IF NOT EXISTS account_id INTEGER;

UPDATE webdrop.cv_profiles cp
SET account_id = ca.id
FROM webdrop.users u
JOIN webdrop.customer_accounts ca ON ca.email = u.email
WHERE cp.user_id = u.id;

-- Verify thủ công trước khi chạy 2 dòng dưới: SELECT id, user_id, account_id FROM webdrop.cv_profiles;
ALTER TABLE webdrop.cv_profiles ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE webdrop.cv_profiles ADD CONSTRAINT cv_profiles_account_id_key UNIQUE (account_id);
ALTER TABLE webdrop.cv_profiles ADD CONSTRAINT cv_profiles_account_id_fkey
    FOREIGN KEY (account_id) REFERENCES webdrop.customer_accounts(id) ON DELETE CASCADE;
ALTER TABLE webdrop.cv_profiles DROP CONSTRAINT IF EXISTS cv_profiles_user_id_fkey;
ALTER TABLE webdrop.cv_profiles DROP COLUMN IF EXISTS user_id;
