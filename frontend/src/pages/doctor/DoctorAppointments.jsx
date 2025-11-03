import { useEffect, useState, useMemo } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { doctorService } from '../../services/doctorService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import TreatmentForm from '../../components/doctor/TreatmentForm';
import { formatDate } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [processingId, setProcessingId] = useState(null);

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

  const handleConfirm = async (appointmentId) => {
    try {
      setProcessingId(appointmentId);
      await doctorService.confirmAppointment(appointmentId);
      await loadAppointments();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm appointment');
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreateTreatment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowTreatmentForm(true);
  };

  const handleTreatmentSuccess = () => {
    setShowTreatmentForm(false);
    setSelectedAppointment(null);
    loadAppointments();
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
  }, []);

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
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
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
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {appointment.status === 'PENDING' && (
                                <button
                                    onClick={() => handleConfirm(appointment.id)}
                                    disabled={processingId === appointment.id}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#3498db',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: processingId === appointment.id ? 'not-allowed' : 'pointer',
                                      fontSize: '12px',
                                      opacity: processingId === appointment.id ? 0.6 : 1,
                                    }}
                                >
                                  {processingId === appointment.id ? 'Confirming...' : 'Confirm'}
                                </button>
                            )}
                            {appointment.status === 'CONFIRMED' && (
                                <button
                                    onClick={() => handleCreateTreatment(appointment)}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#2ecc71',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                    }}
                                >
                                  Create Treatment
                                </button>
                            )}
                            {appointment.status === 'COMPLETED' && (
                                <span style={{ fontSize: '12px', color: '#666' }}>Completed</span>
                            )}
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}

          {showTreatmentForm && (
              <TreatmentForm
                  treatment={null}
                  appointment={selectedAppointment}
                  onClose={() => {
                    setShowTreatmentForm(false);
                    setSelectedAppointment(null);
                  }}
                  onSuccess={handleTreatmentSuccess}
              />
          )}
        </div>
      </DoctorLayout>
  );
};

export default DoctorAppointments;