import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import Loading from '../../components/common/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingFeedbacks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
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
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'Total Doctors', value: stats.totalDoctors, color: '#3498db', icon: '👨‍⚕️' },
    { label: 'Total Patients', value: stats.totalPatients, color: '#2ecc71', icon: '👥' },
    { label: 'Total Appointments', value: stats.totalAppointments, color: '#f39c12', icon: '📅' },
    { label: 'Pending Feedbacks', value: stats.pendingFeedbacks, color: '#e74c3c', icon: '💬' },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {statCards.map((card, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${card.color}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{card.label}</p>
                  <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: card.color }}>
                    {card.value}
                  </h2>
                </div>
                <div style={{ fontSize: '40px' }}>{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <a
              href="/admin/doctors"
              style={{
                padding: '12px 24px',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Manage Doctors
            </a>
            <a
              href="/admin/patients"
              style={{
                padding: '12px 24px',
                backgroundColor: '#2ecc71',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              View Patients
            </a>
            <a
              href="/admin/appointments"
              style={{
                padding: '12px 24px',
                backgroundColor: '#f39c12',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              View Appointments
            </a>
            <a
              href="/admin/feedbacks"
              style={{
                padding: '12px 24px',
                backgroundColor: '#e74c3c',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              View Feedbacks
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

