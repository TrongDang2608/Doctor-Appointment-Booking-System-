# Git Commit Message

## Commit Message:

```
feat: Disable password hashing temporarily and fix authentication issues

- Change backend port from 8080 to 7070
- Temporarily disable BCrypt password hashing (use plain text for development)
  - Create PlainTextPasswordEncoder for development/testing
  - Update SecurityConfig to use PlainTextPasswordEncoder
  - Update AuthService, DoctorService, PatientService to use plain text passwords
  - Update DataInitializer to use plain text password
- Fix authentication flow:
  - Fix AuthService.login to use User entity directly from authentication principal
  - Fix token generation to always use actual username (not email) from database
- Add extensive logging for debugging:
  - Add logging to JwtAuthenticationFilter for request tracking
  - Add logging to UserService for user lookup
  - Add logging to AuthService for login attempts
  - Add logging to PlainTextPasswordEncoder for password matching
  - Add logging to frontend API requests and auth context
- Fix CORS configuration and JWT filter for OPTIONS requests
- Add test endpoints for database and authentication verification
- Create SQL scripts for creating/fixing admin and doctor users
- Fix SQL collation issues using BINARY comparison

Files changed:
- Backend: SecurityConfig, AuthService, DoctorService, PatientService, DataInitializer
- Backend: JwtAuthenticationFilter, UserService, PlainTextPasswordEncoder (new)
- Backend: TestController (new auth-check endpoint)
- Frontend: api.js (add request logging)
- Database: Multiple SQL scripts for user creation and password fixes
- Config: application.properties (port change, logging levels)
```

## Alternative shorter version:

```
feat: Disable password hashing and fix auth issues

- Change backend port to 7070
- Temporarily disable BCrypt (use plain text for dev)
- Fix authentication to use User entity directly
- Add extensive logging for debugging
- Fix CORS and SQL collation issues
- Add SQL scripts for user management
```

## Alternative Vietnamese version:

```
feat: Tắt mã hóa mật khẩu tạm thời và fix lỗi authentication

- Đổi backend port từ 8080 sang 7070
- Tạm thời tắt BCrypt password hashing (dùng plain text cho development)
  - Tạo PlainTextPasswordEncoder cho dev/test
  - Update các service để dùng plain text password
- Fix authentication flow:
  - Fix AuthService.login để dùng User entity trực tiếp
  - Fix token generation để luôn dùng username thực tế từ DB
- Thêm logging để debug
- Fix CORS và SQL collation issues
- Thêm SQL scripts để tạo/fix users
```

