import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PatientLayout from '../../components/patient/PatientLayout';
import { patientService } from '../../services/patientService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import DataTable from '../../components/common/DataTable';
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

  const getStatusColor = useMemo(() => (status) => {
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
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: '600', color: '#2c3e50' }}>
          Booking History
        </h1>

        <ErrorMessage message={error} onClose={() => setError('')} />
        {success && (
          <div style={{
            padding: '15px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '6px',
            color: '#155724',
            marginBottom: '20px',
          }}>
            {success}
          </div>
        )}

        <DataTable
          columns={[
            {
              header: 'Doctor',
              accessor: 'doctorName',
              render: (appointment) => (
                <div>
                  <div style={{ fontWeight: '500' }}>{appointment.doctorName}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {appointment.doctorSpecialization}
                  </div>
                </div>
              )
            },
            {
              header: 'Date',
              accessor: 'appointmentDate',
              render: (appointment) => formatDate(appointment.appointmentDate)
            },
            {
              header: 'Time',
              accessor: 'appointmentTime',
              render: (appointment) => formatTime(appointment.appointmentTime)
            },
            {
              header: 'Status',
              accessor: 'status',
              render: (appointment) => {
                const color = getStatusColor(appointment.status);
                return (
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    backgroundColor: color + '20',
                    color: color,
                    fontSize: '12px',
                    fontWeight: '500',
                  }}>
                    {appointment.status}
                  </span>
                );
              }
            },
            {
              header: 'Notes',
              accessor: 'notes',
              render: (appointment) => (
                <div style={{ maxWidth: '200px', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {appointment.notes || '-'}
                </div>
              )
            },
            {
              header: 'Actions',
              align: 'center',
              render: (appointment) => (
                canCancel(appointment) ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel(appointment.id);
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                  >
                    Cancel
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', color: '#666' }}>-</span>
                )
              )
            }
          ]}
          data={appointments}
          loading={loading && appointments.length === 0}
          emptyMessage={
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ marginBottom: '15px' }}>No appointments found</p>
              <Link
                to="/patient/booking"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#27ae60';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#2ecc71';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Book New Appointment
              </Link>
            </div>
          }
        />
      </div>
    </PatientLayout>
  );
};

export default BookingHistory;
