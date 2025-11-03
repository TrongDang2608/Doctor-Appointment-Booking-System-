import { useEffect, useState, useMemo } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { doctorService } from '../../services/doctorService';
import Loading from '../../components/common/Loading';
import StatCard from '../../components/common/StatCard';
import ActionButton from '../../components/common/ActionButton';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalTreatments: 0,
    upcomingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError('');
      const today = new Date().toISOString().split('T')[0];
      const [todayApps, allApps, treatments] = await Promise.all([
        doctorService.getAppointments(today),
        doctorService.getAppointments(),
        doctorService.getTreatments(),
      ]);

      const pending = allApps.filter(a => a.status === 'PENDING');
      const upcoming = allApps.filter(a => 
        a.status !== 'CANCELLED' && 
        a.status !== 'COMPLETED' &&
        new Date(a.appointmentDate) >= new Date()
      );

      setStats({
        todayAppointments: todayApps.length,
        pendingAppointments: pending.length,
        totalTreatments: treatments.length,
        upcomingAppointments: upcoming.length,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = useMemo(() => [
    { label: "Today's Appointments", value: stats.todayAppointments, color: '#3498db', icon: '📅' },
    { label: 'Pending Appointments', value: stats.pendingAppointments, color: '#f39c12', icon: '⏳' },
    { label: 'Total Treatments', value: stats.totalTreatments, color: '#2ecc71', icon: '💊' },
    { label: 'Upcoming Appointments', value: stats.upcomingAppointments, color: '#9b59b6', icon: '📋' },
  ], [stats]);

  if (loading) {
    return (
      <DoctorLayout>
        <Loading />
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: '600', color: '#2c3e50' }}>
          Doctor Dashboard
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
            <ActionButton to="/doctor/appointments" color="#3498db">
              View Appointments
            </ActionButton>
            <ActionButton to="/doctor/treatments" color="#2ecc71">
              Manage Treatments
            </ActionButton>
            <ActionButton to="/doctor/patients" color="#9b59b6">
              Search Patients
            </ActionButton>
            <ActionButton to="/doctor/profile" color="#f39c12">
              Edit Profile
            </ActionButton>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;

