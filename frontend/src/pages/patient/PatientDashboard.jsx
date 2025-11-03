import { useEffect, useState, useMemo } from 'react';
import PatientLayout from '../../components/patient/PatientLayout';
import { patientService } from '../../services/patientService';
import Loading from '../../components/common/Loading';
import StatCard from '../../components/common/StatCard';
import ActionButton from '../../components/common/ActionButton';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalAppointments: 0,
    totalTreatments: 0,
    pendingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError('');
      const [appointments, treatments] = await Promise.all([
        patientService.getAppointments(),
        patientService.getTreatments(),
      ]);

      const upcoming = appointments.filter(a => 
        a.status !== 'CANCELLED' && 
        a.status !== 'COMPLETED' &&
        new Date(a.appointmentDate) >= new Date()
      );

      const pending = appointments.filter(a => a.status === 'PENDING');

      setStats({
        upcomingAppointments: upcoming.length,
        totalAppointments: appointments.length,
        totalTreatments: treatments.length,
        pendingAppointments: pending.length,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = useMemo(() => [
    { label: 'Upcoming Appointments', value: stats.upcomingAppointments, color: '#3498db', icon: '📅' },
    { label: 'Total Appointments', value: stats.totalAppointments, color: '#2ecc71', icon: '📋' },
    { label: 'My Treatments', value: stats.totalTreatments, color: '#9b59b6', icon: '💊' },
    { label: 'Pending Appointments', value: stats.pendingAppointments, color: '#f39c12', icon: '⏳' },
  ], [stats]);

  if (loading) {
    return (
      <PatientLayout>
        <Loading />
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: '600', color: '#2c3e50' }}>
          Patient Dashboard
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
            <ActionButton to="/patient/booking" color="#2ecc71">
              Book Appointment
            </ActionButton>
            <ActionButton to="/patient/history" color="#3498db">
              View History
            </ActionButton>
            <ActionButton to="/patient/doctors" color="#9b59b6">
              Find Doctors
            </ActionButton>
            <ActionButton to="/patient/treatments" color="#f39c12">
              My Treatments
            </ActionButton>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
