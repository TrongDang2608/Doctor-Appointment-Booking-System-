import { useEffect, useState } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { doctorService } from '../../services/doctorService';
import Loading from '../../components/common/Loading';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalTreatments: 0,
    upcomingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
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
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DoctorLayout>
        <Loading />
      </DoctorLayout>
    );
  }

  const statCards = [
    { label: "Today's Appointments", value: stats.todayAppointments, color: '#3498db', icon: '📅' },
    { label: 'Pending Appointments', value: stats.pendingAppointments, color: '#f39c12', icon: '⏳' },
    { label: 'Total Treatments', value: stats.totalTreatments, color: '#2ecc71', icon: '💊' },
    { label: 'Upcoming Appointments', value: stats.upcomingAppointments, color: '#9b59b6', icon: '📋' },
  ];

  return (
    <DoctorLayout>
      <div>
        <h1 style={{ marginBottom: '30px' }}>Doctor Dashboard</h1>
        
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
              href="/doctor/appointments"
              style={{
                padding: '12px 24px',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              View Appointments
            </a>
            <a
              href="/doctor/treatments"
              style={{
                padding: '12px 24px',
                backgroundColor: '#2ecc71',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Manage Treatments
            </a>
            <a
              href="/doctor/patients"
              style={{
                padding: '12px 24px',
                backgroundColor: '#9b59b6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Search Patients
            </a>
            <a
              href="/doctor/profile"
              style={{
                padding: '12px 24px',
                backgroundColor: '#f39c12',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;

