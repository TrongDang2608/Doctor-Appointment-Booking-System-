# ⚠️ CẢNH BÁO: Plain Text Password

## Trạng thái hiện tại:

Backend đang sử dụng **PlainTextPasswordEncoder** - password KHÔNG được hash, lưu dưới dạng plain text trong database.

## ⚠️ RỦI RO BẢO MẬT:

1. **KHÔNG an toàn**: Nếu database bị hack, hacker sẽ thấy password của tất cả users
2. **KHÔNG dùng trong production**: Chỉ dùng cho development/testing
3. **Dễ bị tấn công**: Không có bảo vệ nào cho password

## Cách hoạt động:

- **Password encoding**: Trả về plain text (không hash)
- **Password matching**: So sánh plain text với plain text trong database

## Files đã thay đổi:

1. `backend/src/main/java/com/doctorbooking/backend/config/PlainTextPasswordEncoder.java` - New file
2. `backend/src/main/java/com/doctorbooking/backend/config/SecurityConfig.java` - Đổi từ BCrypt sang PlainText
3. `backend/src/main/java/com/doctorbooking/backend/service/AuthService.java` - Không hash password khi register
4. `backend/src/main/java/com/doctorbooking/backend/config/DataInitializer.java` - Không hash password khi tạo admin

## Cách đổi lại BCrypt sau khi test xong:

### 1. Sửa SecurityConfig.java:

```java
@Bean
public PasswordEncoder passwordEncoder() {
    // return new PlainTextPasswordEncoder(); // Comment dòng này
    return new BCryptPasswordEncoder(); // Uncomment dòng này
}
```

### 2. Sửa AuthService.java:

```java
// String encodedPassword = request.getPassword(); // Plain text - Comment dòng này
String encodedPassword = passwordEncoder.encode(request.getPassword()); // BCrypt - Uncomment dòng này
```

### 3. Sửa DataInitializer.java:

```java
// adminUser.setPassword(adminPassword); // Plain text - Comment dòng này
adminUser.setPassword(passwordEncoder.encode(adminPassword)); // BCrypt - Uncomment dòng này
```

### 4. Update passwords trong database về BCrypt hash:

- Sử dụng script SQL có BCrypt hash
- Hoặc tạo lại users qua registration API

## Scripts SQL cho plain text:

- `database/create_doctor_plain_text.sql` - Tạo doctor với plain text password
- `database/fix_doctor_password_plain_text.sql` - Fix password về plain text

## Scripts SQL cho BCrypt (khi đổi lại):

- `database/create_doctor.sql` - Tạo doctor với BCrypt hash
- `database/fix_doctor_password.sql` - Fix password về BCrypt hash

## Lưu ý:

- ✅ **OK để dùng**: Development, Testing, Demo
- ❌ **KHÔNG dùng**: Production, Staging, Real user data

