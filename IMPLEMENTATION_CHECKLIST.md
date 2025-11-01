# Implementation Checklist

## ✅ Phase 1: Setup & Authentication

### Backend
- [ ] Cấu hình JWT Authentication (JwtConfig, JwtUtil)
- [ ] Tạo Entity Models: User, Admin, Doctor, Patient
- [ ] Tạo Repository: UserRepository, AdminRepository, DoctorRepository, PatientRepository
- [ ] Implement AuthService (login, register, validate token)
- [ ] Implement JwtService (generate, validate, extract claims)
- [ ] Tạo AuthController với endpoints: POST /api/auth/login, POST /api/auth/register
- [ ] Cấu hình SecurityConfig với JWT filter
- [ ] Cấu hình CORS
- [ ] Tạo DTOs: LoginRequest, RegisterRequest, AuthResponse
- [ ] Exception handling: GlobalExceptionHandler

### Frontend
- [ ] Cài đặt dependencies: axios, react-router-dom, UI library (nếu cần)
- [ ] Tạo AuthContext và useAuth hook
- [ ] Tạo Login page component
- [ ] Tạo Register page component
- [ ] Tạo API service: api.js, authService.js
- [ ] Tạo ProtectedRoute component
- [ ] Setup routing với React Router

---

## ✅ Phase 2: Admin Module

### Backend
- [ ] Tạo Entity: Appointment, Feedback (nếu chưa có)
- [ ] Tạo Repository: AppointmentRepository, FeedbackRepository
- [ ] Implement AdminService
- [ ] Tạo AdminController
  - [ ] GET /api/admin/doctors (list, search)
  - [ ] POST /api/admin/doctors (create)
  - [ ] GET /api/admin/doctors/{id} (detail)
  - [ ] PUT /api/admin/doctors/{id} (update)
  - [ ] DELETE /api/admin/doctors/{id} (delete)
  - [ ] GET /api/admin/patients (search by name, id)
  - [ ] GET /api/admin/patients/{id} (detail with treatments)
  - [ ] GET /api/admin/appointments (filter by date)
  - [ ] GET /api/admin/feedbacks (list)
  - [ ] PUT /api/admin/feedbacks/{id}/read (mark as read)
- [ ] Tạo DTOs cho Admin module

### Frontend
- [ ] Tạo AdminDashboard layout
- [ ] Tạo DoctorManagement component (CRUD)
- [ ] Tạo PatientList component với search
- [ ] Tạo AppointmentList component với date filter
- [ ] Tạo FeedbackList component
- [ ] Implement adminService.js API calls

---

## ✅ Phase 3: Doctor Module

### Backend
- [ ] Tạo Entity: Treatment (nếu chưa có)
- [ ] Tạo Repository: TreatmentRepository
- [ ] Implement DoctorService
- [ ] Tạo DoctorController
  - [ ] GET /api/doctor/profile
  - [ ] PUT /api/doctor/profile
  - [ ] POST /api/doctor/change-password
  - [ ] GET /api/doctor/appointments (filter by date)
  - [ ] GET /api/doctor/appointments/{id}
  - [ ] GET /api/doctor/treatments
  - [ ] POST /api/doctor/treatments
  - [ ] PUT /api/doctor/treatments/{id}
  - [ ] GET /api/doctor/patients (search)
  - [ ] GET /api/doctor/patients/{id}
  - [ ] GET /api/doctor/patients/{id}/treatments
- [ ] Tạo DTOs cho Doctor module

### Frontend
- [ ] Tạo DoctorDashboard layout
- [ ] Tạo DoctorProfile component với change password
- [ ] Tạo DoctorAppointments component với date filter
- [ ] Tạo TreatmentManagement component
- [ ] Tạo PatientSearch component
- [ ] Implement doctorService.js API calls

---

## ✅ Phase 4: Patient Module

### Backend
- [ ] Implement PatientService
- [ ] Tạo PatientController
  - [ ] GET /api/patient/profile
  - [ ] PUT /api/patient/profile
  - [ ] POST /api/patient/change-password
  - [ ] POST /api/patient/appointments (create booking)
  - [ ] GET /api/patient/appointments (history)
  - [ ] GET /api/patient/appointments/{id}
  - [ ] DELETE /api/patient/appointments/{id} (cancel)
  - [ ] GET /api/patient/doctors (search by name, specialization)
  - [ ] GET /api/patient/doctors/{id}
  - [ ] POST /api/patient/feedbacks
  - [ ] GET /api/patient/treatments
  - [ ] GET /api/patient/treatments/{id}
- [ ] Tạo DTOs cho Patient module
- [ ] Validation cho booking (tránh trùng lịch, validate date/time)

### Frontend
- [ ] Tạo PatientDashboard layout
- [ ] Tạo PatientProfile component với change password
- [ ] Tạo NewBooking component (doctor selection, date/time picker)
- [ ] Tạo BookingHistory component với cancel functionality
- [ ] Tạo DoctorSearch component
- [ ] Tạo DoctorDetail component
- [ ] Tạo FeedbackForm component
- [ ] Tạo TreatmentHistory component
- [ ] Implement patientService.js API calls

---

## ✅ Phase 5: Testing & Refinement

### Backend Testing
- [ ] Unit tests cho Services
- [ ] Integration tests cho Controllers
- [ ] Test JWT authentication
- [ ] Test role-based access control
- [ ] Test validation logic

### Frontend Testing
- [ ] Component testing
- [ ] API integration testing
- [ ] User flow testing

### UI/UX
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling UI
- [ ] Success notifications
- [ ] Form validation feedback

### Performance
- [ ] Database query optimization
- [ ] Frontend bundle optimization
- [ ] API response caching (nếu cần)
- [ ] Lazy loading components

### Security
- [ ] SQL injection prevention review
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Password strength validation
- [ ] Rate limiting (nếu cần)

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Code comments
- [ ] User guide
- [ ] Deployment guide

---

## 📝 Notes

- Đánh dấu ✅ khi hoàn thành từng task
- Có thể điều chỉnh checklist dựa trên tiến độ thực tế
- Ưu tiên hoàn thành Phase 1 trước khi chuyển sang Phase tiếp theo
- Test kỹ từng module trước khi tích hợp

---

## 🚀 Deployment Checklist

- [ ] Setup production database
- [ ] Configure production environment variables
- [ ] Build frontend for production
- [ ] Configure CORS for production domain
- [ ] Setup SSL/HTTPS
- [ ] Backup database strategy
- [ ] Monitoring và logging
- [ ] Error tracking

