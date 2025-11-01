import { useEffect, useState } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { doctorService } from '../../services/doctorService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadAppointments();
  }, [filterDate]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAppointments(filterDate || null);
      setAppointments(data);
      setError('');
    } catch (err) {
      setError('Failed to load appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#f39c12';
      case 'CONFIRMED':
        return '#3498db';
      case 'COMPLETED':
        return '#2ecc71';
      case 'CANCELLED':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <DoctorLayout>
        <Loading />
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div>
        <h1 style={{ marginBottom: '20px' }}>My Appointments</h1>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontWeight: '500' }}>Filter by Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              style={{
                padding: '8px 15px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Clear Filter
            </button>
          )}
        </div>

        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
            <p>No appointments found</p>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Patient</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      <div>{appointment.patientName}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{appointment.patientPhone}</div>
                    </td>
                    <td style={{ padding: '12px' }}>{formatDate(appointment.appointmentDate)}</td>
                    <td style={{ padding: '12px' }}>{formatTime(appointment.appointmentTime)}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: getStatusColor(appointment.status) + '20',
                        color: getStatusColor(appointment.status),
                        fontSize: '12px',
                        fontWeight: '500',
                      }}>
                        {appointment.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', maxWidth: '200px', fontSize: '14px' }}>
                      {appointment.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointments;

