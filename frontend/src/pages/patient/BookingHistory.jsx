import { useEffect, useState } from 'react';
import PatientLayout from '../../components/patient/PatientLayout';
import { patientService } from '../../services/patientService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';

const BookingHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAppointments();
      setAppointments(data);
      setError('');
    } catch (err) {
      setError('Failed to load appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await patientService.cancelAppointment(id);
      setSuccess('Appointment cancelled successfully');
      setTimeout(() => setSuccess(''), 3000);
      loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel appointment');
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

  const canCancel = (appointment) => {
    return appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED';
  };

  if (loading) {
    return (
      <PatientLayout>
        <Loading />
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div>
        <h1 style={{ marginBottom: '20px' }}>Booking History</h1>

        <ErrorMessage message={error} onClose={() => setError('')} />
        {success && (
          <div style={{
            padding: '15px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            color: '#155724',
            marginBottom: '15px',
          }}>
            {success}
          </div>
        )}

        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
            <p>No appointments found</p>
            <a
              href="/patient/booking"
              style={{
                display: 'inline-block',
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
              }}
            >
              Book New Appointment
            </a>
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
                  <th style={{ padding: '12px', textAlign: 'left' }}>Doctor</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Notes</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      <div>{appointment.doctorName}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{appointment.doctorSpecialization}</div>
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
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {canCancel(appointment) && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default BookingHistory;
