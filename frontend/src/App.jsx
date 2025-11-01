import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Import Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import PatientList from './pages/admin/PatientList';
import AppointmentList from './pages/admin/AppointmentList';
import FeedbackList from './pages/admin/FeedbackList';

// Import Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import TreatmentManagement from './pages/doctor/TreatmentManagement';
import PatientSearch from './pages/doctor/PatientSearch';

// Import Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import NewBooking from './pages/patient/NewBooking';
import BookingHistory from './pages/patient/BookingHistory';
import DoctorSearch from './pages/patient/DoctorSearch';
import FeedbackForm from './pages/patient/FeedbackForm';
import TreatmentHistory from './pages/patient/TreatmentHistory';
const Unauthorized = () => <div><h1>Unauthorized</h1><p>You don't have permission to access this page.</p></div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="doctors" element={<DoctorManagement />} />
                  <Route path="patients" element={<PatientList />} />
                  <Route path="appointments" element={<AppointmentList />} />
                  <Route path="feedbacks" element={<FeedbackList />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute requiredRole="DOCTOR">
                <Routes>
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="profile" element={<DoctorProfile />} />
                  <Route path="appointments" element={<DoctorAppointments />} />
                  <Route path="treatments" element={<TreatmentManagement />} />
                  <Route path="patients" element={<PatientSearch />} />
                  <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute requiredRole="PATIENT">
                <Routes>
                  <Route path="dashboard" element={<PatientDashboard />} />
                  <Route path="profile" element={<PatientProfile />} />
                  <Route path="booking" element={<NewBooking />} />
                  <Route path="history" element={<BookingHistory />} />
                  <Route path="doctors" element={<DoctorSearch />} />
                  <Route path="treatments" element={<TreatmentHistory />} />
                  <Route path="feedback" element={<FeedbackForm />} />
                  <Route path="*" element={<Navigate to="/patient/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Error pages */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
