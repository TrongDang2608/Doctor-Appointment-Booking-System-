import { useEffect, useState } from 'react';
import PatientLayout from '../../components/patient/PatientLayout';
import { patientService } from '../../services/patientService';
import Loading from '../../components/common/Loading';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalAppointments: 0,
    totalTreatments: 0,
    pendingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
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
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PatientLayout>
        <Loading />
      </PatientLayout>
    );
  }

  const statCards = [
    { label: 'Upcoming Appointments', value: stats.upcomingAppointments, color: '#3498db', icon: '📅' },
    { label: 'Total Appointments', value: stats.totalAppointments, color: '#2ecc71', icon: '📋' },
    { label: 'My Treatments', value: stats.totalTreatments, color: '#9b59b6', icon: '💊' },
    { label: 'Pending Appointments', value: stats.pendingAppointments, color: '#f39c12', icon: '⏳' },
  ];

  return (
    <PatientLayout>
      <div>
        <h1 style={{ marginBottom: '30px' }}>Patient Dashboard</h1>
        
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
              href="/patient/booking"
              style={{
                padding: '12px 24px',
                backgroundColor: '#2ecc71',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Book Appointment
            </a>
            <a
              href="/patient/history"
              style={{
                padding: '12px 24px',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              View History
            </a>
            <a
              href="/patient/doctors"
              style={{
                padding: '12px 24px',
                backgroundColor: '#9b59b6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Find Doctors
            </a>
            <a
              href="/patient/treatments"
              style={{
                padding: '12px 24px',
                backgroundColor: '#f39c12',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              My Treatments
            </a>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
