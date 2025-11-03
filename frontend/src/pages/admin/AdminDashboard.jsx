import { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import Loading from '../../components/common/Loading';
import StatCard from '../../components/common/StatCard';
import ActionButton from '../../components/common/ActionButton';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingFeedbacks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError('');
      const [doctors, patients, appointments, feedbacks] = await Promise.all([
        adminService.getAllDoctors(),
        adminService.searchPatients(),
        adminService.getAllAppointments(),
        adminService.getAllFeedbacks('PENDING'),
      ]);

      setStats({
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        pendingFeedbacks: feedbacks.length,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = useMemo(() => [
    { label: 'Total Doctors', value: stats.totalDoctors, color: '#3498db', icon: '👨‍⚕️' },
    { label: 'Total Patients', value: stats.totalPatients, color: '#2ecc71', icon: '👥' },
    { label: 'Total Appointments', value: stats.totalAppointments, color: '#f39c12', icon: '📅' },
    { label: 'Pending Feedbacks', value: stats.pendingFeedbacks, color: '#e74c3c', icon: '💬' },
  ], [stats]);

  if (loading) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: '600', color: '#2c3e50' }}>
          Admin Dashboard
        </h1>
        
        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 16px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '6px',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600', color: '#2c3e50' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <ActionButton to="/admin/doctors" color="#3498db">
              Manage Doctors
            </ActionButton>
            <ActionButton to="/admin/patients" color="#2ecc71">
              View Patients
            </ActionButton>
            <ActionButton to="/admin/appointments" color="#f39c12">
              View Appointments
            </ActionButton>
            <ActionButton to="/admin/feedbacks" color="#e74c3c">
              View Feedbacks
            </ActionButton>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

