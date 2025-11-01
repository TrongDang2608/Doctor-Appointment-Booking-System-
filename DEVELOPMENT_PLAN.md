# Kế Hoạch Xây Dựng Hệ Thống Đặt Lịch Hẹn Bác Sĩ

## 📋 Mục Lục
1. [Tổng Quan Dự Án](#tổng-quan-dự-án)
2. [Thiết Kế Database](#thiết-kế-database)
3. [Kiến Trúc Backend (Spring Boot)](#kiến-trúc-backend-spring-boot)
4. [Kiến Trúc Frontend (React + Vite)](#kiến-trúc-frontend-react--vite)
5. [Lộ Trình Phát Triển](#lộ-trình-phát-triển)
6. [API Endpoints](#api-endpoints)

---

## 📌 Tổng Quan Dự Án

### Công Nghệ Sử Dụng
- **Backend**: Java Spring Boot 3.5.6
- **Frontend**: React 19 + Vite
- **Database**: MySQL
- **Security**: Spring Security (JWT)
- **ORM**: JPA/Hibernate

### Các Module Chính
1. **Admin Module**: Quản lý hệ thống, bác sĩ, xem bệnh nhân và lịch hẹn
2. **Doctor Module**: Quản lý hồ sơ, xem lịch hẹn, quản lý điều trị
3. **Patient Module**: Đăng ký, đặt lịch, xem lịch sử, tìm kiếm bác sĩ

---

## 🗄️ Thiết Kế Database

### Các Bảng Cần Tạo

#### 1. **users** - Bảng người dùng chung
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- username (VARCHAR(50), UNIQUE, NOT NULL)
- password (VARCHAR(255), NOT NULL) - BCrypt encoded
- email (VARCHAR(100), UNIQUE, NOT NULL)
- role (ENUM: 'ADMIN', 'DOCTOR', 'PATIENT', NOT NULL)
- enabled (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. **admins** - Thông tin quản trị viên
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (BIGINT, FOREIGN KEY -> users.id, UNIQUE)
- full_name (VARCHAR(100), NOT NULL)
- phone (VARCHAR(20))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. **doctors** - Thông tin bác sĩ
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (BIGINT, FOREIGN KEY -> users.id, UNIQUE)
- full_name (VARCHAR(100), NOT NULL)
- specialization (VARCHAR(100), NOT NULL) - Chuyên môn
- qualification (VARCHAR(200)) - Trình độ
- experience (INT) - Số năm kinh nghiệm
- phone (VARCHAR(20))
- address (VARCHAR(255))
- bio (TEXT) - Tiểu sử
- status (ENUM: 'ACTIVE', 'INACTIVE', DEFAULT 'ACTIVE')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 4. **patients** - Thông tin bệnh nhân
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (BIGINT, FOREIGN KEY -> users.id, UNIQUE)
- full_name (VARCHAR(100), NOT NULL)
- date_of_birth (DATE)
- gender (ENUM: 'MALE', 'FEMALE', 'OTHER')
- phone (VARCHAR(20))
- address (VARCHAR(255))
- emergency_contact (VARCHAR(100))
- emergency_phone (VARCHAR(20))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 5. **appointments** - Lịch hẹn
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- patient_id (BIGINT, FOREIGN KEY -> patients.id)
- doctor_id (BIGINT, FOREIGN KEY -> doctors.id)
- appointment_date (DATE, NOT NULL)
- appointment_time (TIME, NOT NULL) - Khung giờ
- status (ENUM: 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', DEFAULT 'PENDING')
- notes (TEXT) - Ghi chú từ bệnh nhân
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE KEY (doctor_id, appointment_date, appointment_time) - Tránh trùng lịch
```

#### 6. **treatments** - Điều trị
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- appointment_id (BIGINT, FOREIGN KEY -> appointments.id)
- doctor_id (BIGINT, FOREIGN KEY -> doctors.id)
- patient_id (BIGINT, FOREIGN KEY -> patients.id)
- diagnosis (TEXT) - Chẩn đoán
- prescription (TEXT) - Đơn thuốc
- treatment_notes (TEXT) - Ghi chú điều trị
- follow_up_date (DATE) - Ngày tái khám
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 7. **feedbacks** - Phản hồi
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- patient_id (BIGINT, FOREIGN KEY -> patients.id)
- appointment_id (BIGINT, FOREIGN KEY -> appointments.id, NULLABLE)
- rating (INT, CHECK 1-5) - Đánh giá 1-5 sao
- comment (TEXT) - Bình luận
- status (ENUM: 'PENDING', 'READ', DEFAULT 'PENDING')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 8. **time_slots** - Khung giờ khám (Optional - để quản lý khung giờ)
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- start_time (TIME, NOT NULL) - Giờ bắt đầu
- end_time (TIME, NOT NULL) - Giờ kết thúc
- is_available (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP)
```

---

## 🏗️ Kiến Trúc Backend (Spring Boot)

### Cấu Trúc Thư Mục
```
backend/src/main/java/com/doctorbooking/backend/
├── BackendApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   └── CorsConfig.java
├── model/
│   ├── User.java
│   ├── Admin.java
│   ├── Doctor.java
│   ├── Patient.java
│   ├── Appointment.java
│   ├── Treatment.java
│   └── Feedback.java
├── repository/
│   ├── UserRepository.java
│   ├── AdminRepository.java
│   ├── DoctorRepository.java
│   ├── PatientRepository.java
│   ├── AppointmentRepository.java
│   ├── TreatmentRepository.java
│   └── FeedbackRepository.java
├── service/
│   ├── AuthService.java
│   ├── JwtService.java
│   ├── UserService.java
│   ├── AdminService.java
│   ├── DoctorService.java
│   ├── PatientService.java
│   ├── AppointmentService.java
│   ├── TreatmentService.java
│   └── FeedbackService.java
├── controller/
│   ├── AuthController.java
│   ├── AdminController.java
│   ├── DoctorController.java
│   ├── PatientController.java
│   ├── AppointmentController.java
│   ├── TreatmentController.java
│   └── FeedbackController.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── UpdateProfileRequest.java
│   │   ├── ChangePasswordRequest.java
│   │   ├── CreateAppointmentRequest.java
│   │   ├── CreateTreatmentRequest.java
│   │   └── CreateFeedbackRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── DoctorResponse.java
│       ├── PatientResponse.java
│       ├── AppointmentResponse.java
│       ├── TreatmentResponse.java
│       └── FeedbackResponse.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── UnauthorizedException.java
└── util/
    └── JwtUtil.java
```

### Dependencies Cần Thêm vào pom.xml
```xml
<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

---

## 🎨 Kiến Trúc Frontend (React + Vite)

### Cấu Trúc Thư Mục
```
frontend/src/
├── main.jsx
├── App.jsx
├── index.css
├── assets/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── ProtectedRoute.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── DoctorManagement.jsx
│   │   ├── PatientList.jsx
│   │   ├── AppointmentList.jsx
│   │   └── FeedbackList.jsx
│   ├── doctor/
│   │   ├── DoctorDashboard.jsx
│   │   ├── DoctorProfile.jsx
│   │   ├── DoctorAppointments.jsx
│   │   ├── TreatmentManagement.jsx
│   │   └── PatientSearch.jsx
│   └── patient/
│       ├── PatientDashboard.jsx
│       ├── PatientProfile.jsx
│       ├── NewBooking.jsx
│       ├── BookingHistory.jsx
│       ├── DoctorSearch.jsx
│       ├── DoctorDetail.jsx
│       ├── TreatmentHistory.jsx
│       └── FeedbackForm.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── NotFound.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── adminService.js
│   ├── doctorService.js
│   ├── patientService.js
│   ├── appointmentService.js
│   └── treatmentService.js
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useLocalStorage.js
├── utils/
│   ├── constants.js
│   ├── formatDate.js
│   └── formatTime.js
└── styles/
    └── global.css
```

### Dependencies Cần Cài Đặt
```bash
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
# Hoặc sử dụng UI library như Material-UI, Ant Design
npm install @mui/material @emotion/react @emotion/styled
# Hoặc
npm install antd
```

---

## 📅 Lộ Trình Phát Triển

### Phase 1: Setup & Authentication (Tuần 1-2)

#### Backend:
1. ✅ Setup project (Đã có)
2. ⏳ Cấu hình JWT Authentication
3. ⏳ Tạo các Entity Models (User, Admin, Doctor, Patient)
4. ⏳ Tạo Repository layer
5. ⏳ Implement AuthService và JwtService
6. ⏳ Tạo AuthController (login, register)
7. ⏳ Cấu hình Security với JWT

#### Frontend:
1. ✅ Setup project (Đã có)
2. ⏳ Cài đặt dependencies (axios, router, UI library)
3. ⏳ Tạo AuthContext và useAuth hook
4. ⏳ Tạo Login và Register pages
5. ⏳ Tạo API service layer
6. ⏳ Implement ProtectedRoute component

### Phase 2: Admin Module (Tuần 3-4)

#### Backend:
1. ⏳ Tạo AdminController
2. ⏳ Implement Doctor CRUD APIs
3. ⏳ Implement Patient search APIs
4. ⏳ Implement Appointment viewing APIs
5. ⏳ Implement Feedback viewing APIs

#### Frontend:
1. ⏳ Tạo AdminDashboard
2. ⏳ Tạo DoctorManagement (CRUD)
3. ⏳ Tạo PatientList với search
4. ⏳ Tạo AppointmentList với filter by date
5. ⏳ Tạo FeedbackList

### Phase 3: Doctor Module (Tuần 5-6)

#### Backend:
1. ⏳ Tạo DoctorController
2. ⏳ Implement Profile management APIs
3. ⏳ Implement Appointment viewing APIs
4. ⏳ Implement Treatment CRUD APIs
5. ⏳ Implement Patient search APIs

#### Frontend:
1. ⏳ Tạo DoctorDashboard
2. ⏳ Tạo DoctorProfile với change password
3. ⏳ Tạo DoctorAppointments với filter
4. ⏳ Tạo TreatmentManagement
5. ⏳ Tạo PatientSearch

### Phase 4: Patient Module (Tuần 7-8)

#### Backend:
1. ⏳ Tạo PatientController
2. ⏳ Implement Profile management APIs
3. ⏳ Implement Appointment booking APIs
4. ⏳ Implement Appointment history APIs
5. ⏳ Implement Doctor search APIs
6. ⏳ Implement Feedback APIs
7. ⏳ Implement Treatment viewing APIs

#### Frontend:
1. ⏳ Tạo PatientDashboard
2. ⏳ Tạo PatientProfile với change password
3. ⏳ Tạo NewBooking với doctor selection
4. ⏳ Tạo BookingHistory với cancel functionality
5. ⏳ Tạo DoctorSearch và DoctorDetail
6. ⏳ Tạo FeedbackForm
7. ⏳ Tạo TreatmentHistory

### Phase 5: Testing & Refinement (Tuần 9-10)

1. ⏳ Unit testing
2. ⏳ Integration testing
3. ⏳ UI/UX improvements
4. ⏳ Performance optimization
5. ⏳ Security audit
6. ⏳ Documentation

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login          - Đăng nhập
POST   /api/auth/register       - Đăng ký (Patient)
POST   /api/auth/refresh        - Refresh token
```

### Admin APIs
```
GET    /api/admin/doctors       - Lấy danh sách bác sĩ
POST   /api/admin/doctors       - Tạo bác sĩ mới
GET    /api/admin/doctors/{id}  - Xem chi tiết bác sĩ
PUT    /api/admin/doctors/{id}  - Cập nhật bác sĩ
DELETE /api/admin/doctors/{id}  - Xóa bác sĩ

GET    /api/admin/patients      - Tìm kiếm bệnh nhân (query: name, id)
GET    /api/admin/patients/{id} - Xem chi tiết bệnh nhân

GET    /api/admin/appointments  - Xem lịch hẹn (query: date)
GET    /api/admin/appointments/{id} - Chi tiết lịch hẹn

GET    /api/admin/feedbacks     - Xem phản hồi
GET    /api/admin/feedbacks/{id} - Chi tiết phản hồi
PUT    /api/admin/feedbacks/{id}/read - Đánh dấu đã đọc
```

### Doctor APIs
```
GET    /api/doctor/profile      - Xem hồ sơ
PUT    /api/doctor/profile      - Cập nhật hồ sơ
POST   /api/doctor/change-password - Đổi mật khẩu

GET    /api/doctor/appointments - Xem lịch hẹn (query: date)
GET    /api/doctor/appointments/{id} - Chi tiết lịch hẹn

GET    /api/doctor/treatments   - Xem danh sách điều trị
POST   /api/doctor/treatments   - Tạo điều trị mới
PUT    /api/doctor/treatments/{id} - Cập nhật điều trị
GET    /api/doctor/treatments/{id} - Chi tiết điều trị

GET    /api/doctor/patients     - Tìm kiếm bệnh nhân (query: name, id)
GET    /api/doctor/patients/{id} - Chi tiết bệnh nhân
GET    /api/doctor/patients/{id}/treatments - Lịch sử điều trị của bệnh nhân
```

### Patient APIs
```
GET    /api/patient/profile     - Xem hồ sơ
PUT    /api/patient/profile     - Cập nhật hồ sơ
POST   /api/patient/change-password - Đổi mật khẩu

POST   /api/patient/appointments - Đặt lịch hẹn mới
GET    /api/patient/appointments - Xem lịch sử đặt chỗ
GET    /api/patient/appointments/{id} - Chi tiết lịch hẹn
DELETE /api/patient/appointments/{id} - Hủy lịch hẹn

GET    /api/patient/doctors     - Tìm kiếm bác sĩ (query: name, specialization)
GET    /api/patient/doctors/{id} - Chi tiết bác sĩ

POST   /api/patient/feedbacks   - Gửi phản hồi

GET    /api/patient/treatments   - Xem lịch sử điều trị
GET    /api/patient/treatments/{id} - Chi tiết điều trị
```

---

## 🔐 Security Considerations

1. **JWT Authentication**: Sử dụng JWT token cho tất cả các API requests
2. **Password Encryption**: Sử dụng BCrypt để mã hóa mật khẩu
3. **Role-based Access Control**: Kiểm tra role trước khi truy cập resources
4. **CORS Configuration**: Cấu hình CORS để frontend có thể gọi API
5. **Input Validation**: Validate tất cả inputs từ client
6. **SQL Injection Prevention**: Sử dụng JPA Repository (parameterized queries)

---

## 📝 Notes

- Tất cả timestamps sử dụng UTC
- Date format: yyyy-MM-dd
- Time format: HH:mm:ss
- JWT token expiration: 24 giờ (có thể điều chỉnh)
- Refresh token expiration: 7 ngày
- File upload (nếu cần): Sử dụng Spring MultipartFile
- Pagination: Sử dụng Spring Data JPA Pageable cho danh sách

---

## 🚀 Quick Start Commands

### Backend
```bash
cd backend
# Chạy ứng dụng
mvn spring-boot:run
# Build
mvn clean package
```

### Frontend
```bash
cd frontend
# Install dependencies
npm install
# Development server
npm run dev
# Build for production
npm run build
```

---

*Kế hoạch này có thể được điều chỉnh trong quá trình phát triển dựa trên yêu cầu thực tế.*

