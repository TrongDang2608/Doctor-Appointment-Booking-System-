# Database Setup Guide

## Cài Đặt Database

### 1. Tạo Database
```bash
mysql -u root -p
source database/schema.sql
```

Hoặc chạy từng lệnh SQL trong file `schema.sql`.

### 2. Cấu Hình Connection

Cập nhật file `.env` hoặc `application.properties`:

```properties
DB_URL=jdbc:mysql://localhost:3306/doctor_booking_system?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 3. Tạo Admin User Mẫu

Sau khi chạy ứng dụng Spring Boot lần đầu, bạn có thể:
- Tạo admin user thông qua API
- Hoặc chạy script tạo admin trong database

**Lưu ý**: Mật khẩu phải được hash bằng BCrypt trước khi lưu vào database.

### 4. Khung Giờ Khám

Bảng `time_slots` đã được populate với các khung giờ mặc định (8:00 - 17:00, mỗi 30 phút).

Bạn có thể điều chỉnh các khung giờ này tùy theo yêu cầu.

## Database Schema Overview

### Tables
1. **users** - Người dùng chung (Admin, Doctor, Patient)
2. **admins** - Thông tin quản trị viên
3. **doctors** - Thông tin bác sĩ
4. **patients** - Thông tin bệnh nhân
5. **appointments** - Lịch hẹn
6. **treatments** - Điều trị
7. **feedbacks** - Phản hồi
8. **time_slots** - Khung giờ khám (optional)

### Relationships
- `users` → `admins` (1:1)
- `users` → `doctors` (1:1)
- `users` → `patients` (1:1)
- `patients` → `appointments` (1:N)
- `doctors` → `appointments` (1:N)
- `appointments` → `treatments` (1:N)
- `patients` → `feedbacks` (1:N)
- `appointments` → `feedbacks` (1:N)

### Indexes
Tất cả các foreign keys và các trường thường xuyên được query đã được đánh index để tối ưu hiệu suất.

