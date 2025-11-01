import { useNavigate } from 'react-router-dom';

const DoctorDetail = ({ doctor, onClose }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    onClose();
    navigate('/patient/booking', { state: { doctorId: doctor.id } });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Doctor Details</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <strong>Name:</strong> Dr. {doctor.fullName}
          </div>
          <div>
            <strong>Specialization:</strong> {doctor.specialization}
          </div>
          {doctor.qualification && (
            <div>
              <strong>Qualification:</strong> {doctor.qualification}
            </div>
          )}
          {doctor.experience > 0 && (
            <div>
              <strong>Experience:</strong> {doctor.experience} years
            </div>
          )}
          {doctor.phone && (
            <div>
              <strong>Phone:</strong> {doctor.phone}
            </div>
          )}
          {doctor.address && (
            <div>
              <strong>Address:</strong> {doctor.address}
            </div>
          )}
          {doctor.bio && (
            <div>
              <strong>Bio:</strong>
              <p style={{ marginTop: '5px', color: '#666', lineHeight: '1.6' }}>{doctor.bio}</p>
            </div>
          )}
          <div>
            <strong>Status:</strong>{' '}
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: doctor.status === 'ACTIVE' ? '#d4edda' : '#f8d7da',
              color: doctor.status === 'ACTIVE' ? '#155724' : '#721c24',
              fontSize: '12px',
            }}>
              {doctor.status}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
          {doctor.status === 'ACTIVE' && (
            <button
              onClick={handleBookAppointment}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Book Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;

