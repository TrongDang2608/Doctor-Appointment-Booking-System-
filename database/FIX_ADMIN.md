# Quick Fix: Admin Login Issue

## Vấn đề hiện tại
- Tìm thấy user trong database ✅
- Nhưng password không match ❌

## Giải pháp nhanh

### Option 1: Reset Password (Khuyến nghị)

Chạy SQL này trong MySQL để reset password admin:

```sql
-- Reset password cho admin (password: admin123)
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE username = 'admin' OR email = 'admin@hospital.com';
```

### Option 2: Xóa và tạo lại admin

```sql
-- Xóa admin cũ
DELETE FROM admins WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

-- Tạo admin mới
INSERT INTO users (username, password, email, role, enabled, created_at, updated_at)
VALUES (
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin@hospital.com',
    'ADMIN',
    TRUE,
    NOW(),
    NOW()
);

SET @admin_user_id = LAST_INSERT_ID();

INSERT INTO admins (user_id, full_name, phone, created_at, updated_at)
VALUES (@admin_user_id, 'System Administrator', '0123456789', NOW(), NOW());
```

### Option 3: Generate Password Hash mới

1. Mở terminal trong thư mục `backend`
2. Chạy:
```bash
mvn compile exec:java -Dexec.mainClass="com.doctorbooking.backend.util.PasswordHashGenerator" -Dexec.classpathScope=compile
```

3. Copy hash được generate
4. Update trong database:
```sql
UPDATE users SET password = '<NEW_HASH>' WHERE username = 'admin';
```

## Sau khi fix

Login với:
- **Username:** `admin` hoặc `admin@hospital.com`
- **Password:** `admin123`

