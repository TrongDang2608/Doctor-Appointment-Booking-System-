# Hướng dẫn tạo user Doctor

## Các cách tạo Doctor:

### Cách 1: Tạo một Doctor đơn giản (Khuyên dùng)

Chạy script `database/create_doctor.sql`:

```sql
-- Script này tạo doctor với:
-- Username: doctor1
-- Email: doctor1@hospital.com
-- Password: doctor123
-- Full Name: Doctor One
-- Specialization: General Medicine
```

### Cách 2: Tạo Doctor với thông tin tùy chỉnh

Chạy script `database/create_doctor_complete.sql` và chỉnh sửa các biến:

```sql
SET @doctor_username = 'doctor1';
SET @doctor_email = 'doctor1@hospital.com';
SET @doctor_password = 'doctor123';
SET @doctor_full_name = 'Dr. One';
SET @doctor_specialization = 'General Medicine';
-- ... và các thông tin khác
```

### Cách 3: Tạo nhiều Doctors mẫu

Chạy script `database/create_multiple_doctors.sql` để tạo 4 doctors mẫu:
- doctor1 - General Medicine
- doctor2 - Cardiology  
- doctor3 - Pediatrics
- doctor4 - Orthopedics

## Thông tin đăng nhập mặc định:

- **Username**: `doctor1` (hoặc tên bạn đặt)
- **Email**: `doctor1@hospital.com` (hoặc email bạn đặt)
- **Password**: `doctor123`

## Lưu ý quan trọng:

1. **Password phải được hash bằng BCrypt**:
   - ❌ Không được lưu plain text: `doctor123`
   - ✅ Phải là hash: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

2. **Role phải đúng format**:
   - ✅ Phải là `'DOCTOR'` (uppercase)
   - ❌ Không phải `'doctor'`, `'Doctor'`, hay bất kỳ format nào khác

3. **Enabled phải là TRUE**:
   - ✅ `TRUE` hoặc `1`
   - ❌ `FALSE` hoặc `0` sẽ không đăng nhập được

4. **Status trong bảng doctors**:
   - Có thể là: `'ACTIVE'`, `'INACTIVE'`, `'ON_LEAVE'`
   - Mặc định nên dùng `'ACTIVE'`

## Nếu muốn đổi password:

1. **Sử dụng Java code** (nếu có backend):
```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hash = encoder.encode("new-password");
System.out.println(hash);
```

2. **Hoặc sử dụng online BCrypt generator**:
   - Đảm bảo cost factor là 10
   - Copy hash và update vào database

## Kiểm tra Doctor đã tạo đúng:

```sql
SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    u.enabled,
    d.full_name,
    d.specialization,
    d.status,
    CASE 
        WHEN u.password LIKE '$2a$%' THEN '✅ Password OK'
        ELSE '❌ Password NOT OK'
    END as password_status
FROM users u
LEFT JOIN doctors d ON d.user_id = u.id
WHERE u.role = 'DOCTOR';
```

## Troubleshooting:

### Không đăng nhập được?

1. **Kiểm tra password hash**:
   ```sql
   SELECT username, 
          CASE WHEN password LIKE '$2a$%' THEN 'OK' ELSE 'NOT OK' END as hash_status
   FROM users WHERE username = 'doctor1';
   ```

2. **Kiểm tra role**:
   ```sql
   SELECT username, role FROM users WHERE username = 'doctor1';
   -- Phải là 'DOCTOR' (uppercase)
   ```

3. **Kiểm tra enabled**:
   ```sql
   SELECT username, enabled FROM users WHERE username = 'doctor1';
   -- Phải là TRUE hoặc 1
   ```

4. **Restart backend** sau khi sửa database

5. **Kiểm tra backend logs** khi login để xem lỗi cụ thể

## Sau khi tạo xong:

1. Restart backend
2. Đăng nhập với thông tin đã tạo
3. Nếu vẫn không được, kiểm tra logs và verify các bước trên

