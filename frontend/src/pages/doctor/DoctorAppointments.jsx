import { useEffect, useState, useMemo } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { doctorService } from '../../services/doctorService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import DataTable from '../../components/common/DataTable';
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

  if (loading && appointments.length === 0) {
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
          My Appointments
        </h1>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: '500', color: '#495057' }}>Filter by Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#7f8c8d';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#95a5a6';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Clear Filter
            </button>
          )}
        </div>

        <DataTable
          columns={[
            {
              header: 'Patient',
              accessor: 'patientName',
              render: (appointment) => (
                <div>
                  <div style={{ fontWeight: '500' }}>{appointment.patientName}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {appointment.patientPhone}
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
            }
          ]}
          data={appointments}
          loading={loading && appointments.length === 0}
          emptyMessage={filterDate ? `No appointments found for ${formatDate(filterDate)}` : 'No appointments found'}
        />
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointments;

