# Hướng dẫn tạo và fix user adminDat

## Vấn đề thường gặp khi tạo user trực tiếp trong database:

1. **Password không được hash bằng BCrypt**: Spring Security yêu cầu password phải được hash bằng BCrypt, không thể lưu plain text
2. **Role không đúng format**: Phải là `'ADMIN'` (uppercase), không phải `'admin'` hay `'Admin'`
3. **User không enabled**: Field `enabled` phải là `TRUE` hoặc `1`
4. **Thiếu admin profile**: Có thể thiếu record trong bảng `admins`

## Giải pháp:

### Cách 1: Sử dụng script SQL (Khuyên dùng)

Chạy script `database/create_adminDat_complete.sql` trong database của bạn:

```sql
-- Script sẽ:
-- 1. Xóa user cũ (nếu có)
-- 2. Tạo user mới với password đã hash
-- 3. Tạo admin profile
-- 4. Verify user đã được tạo đúng
```

### Cách 2: Tạo user thủ công

1. **Tạo user với password đã hash**:
   - Password: `admin123`
   - BCrypt Hash: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

```sql
INSERT INTO users (username, email, password, role, enabled, created_at, updated_at)
VALUES (
    'adminDat',
    'adminDat@hospital.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    TRUE,
    NOW(),
    NOW()
);
```

2. **Tạo admin profile**:
```sql
INSERT INTO admins (user_id, full_name, phone, created_at, updated_at)
SELECT 
    u.id,
    'Admin Dat',
    '0123456789',
    NOW(),
    NOW()
FROM users u
WHERE u.username = 'adminDat';
```

### Cách 3: Sử dụng Backend để tạo (Khuyên dùng nhất)

Nếu bạn muốn tạo user mới an toàn, tốt nhất là:
1. Tạo thông qua API registration (nếu có)
2. Hoặc restart backend - `DataInitializer` sẽ tự động tạo user `admin` với password `admin123`

## Kiểm tra user đã tạo đúng chưa:

```sql
-- Kiểm tra user
SELECT 
    id,
    username,
    email,
    role,
    enabled,
    CASE 
        WHEN password LIKE '$2a$%' THEN 'BCrypt ✓'
        ELSE 'NOT BCrypt ✗'
    END as password_type
FROM users
WHERE username = 'adminDat';

-- Kiểm tra admin profile
SELECT 
    u.username,
    u.role,
    u.enabled,
    a.full_name
FROM users u
LEFT JOIN admins a ON a.user_id = u.id
WHERE u.username = 'adminDat';
```

## Thông tin đăng nhập:

- **Username**: `adminDat` hoặc `adminDat@hospital.com`
- **Password**: `admin123`

## Nếu vẫn không đăng nhập được:

1. **Kiểm tra password hash**:
   - Password phải bắt đầu bằng `$2a$` (BCrypt format)
   - Nếu không, cần generate lại hash

2. **Kiểm tra role**:
   - Phải là `'ADMIN'` (uppercase)
   - Không phải `'admin'`, `'Admin'`, hay bất kỳ format nào khác

3. **Kiểm tra enabled**:
   - Phải là `TRUE` hoặc `1`
   - Nếu là `FALSE` hoặc `0`, user sẽ không đăng nhập được

4. **Restart backend**:
   - Sau khi fix database, restart backend để đảm bảo cache được clear

5. **Kiểm tra backend logs**:
   - Xem có lỗi gì khi login không
   - Log sẽ hiển thị: "User not found" hoặc "Bad credentials"

## Generate password hash mới:

Nếu muốn đổi password, có thể sử dụng Java code:

```java
// Chạy trong backend để generate hash mới
PasswordHashGenerator.main(new String[]{"your-new-password"});
```

Hoặc sử dụng online BCrypt generator (đảm bảo cost factor là 10).

