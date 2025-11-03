import { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import ErrorMessage from '../common/ErrorMessage';
import { formatDate } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';

const TreatmentForm = ({ treatment, appointment, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    appointmentId: null,
    patientId: null,
    diagnosis: '',
    prescription: '',
    treatmentNotes: '',
    followUpDate: '',
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatients();
    if (treatment) {
      // Edit existing treatment
      setFormData({
        appointmentId: treatment.appointmentId || null,
        patientId: treatment.patientId,
        diagnosis: treatment.diagnosis || '',
        prescription: treatment.prescription || '',
        treatmentNotes: treatment.treatmentNotes || '',
        followUpDate: treatment.followUpDate || '',
      });
    } else if (appointment) {
      // Create treatment from appointment
      setFormData({
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        diagnosis: '',
        prescription: '',
        treatmentNotes: '',
        followUpDate: '',
      });
    }
  }, [treatment, appointment]);

  const loadPatients = async () => {
    try {
      const data = await doctorService.searchPatients('');
      setPatients(data);
    } catch (err) {
      console.error('Failed to load patients:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (treatment) {
        await doctorService.updateTreatment(treatment.id, formData);
      } else {
        if (!formData.patientId) {
          setError('Please select a patient');
          setLoading(false);
          return;
        }
        const treatmentData = {
          ...formData,
          patientId: parseInt(formData.patientId),
          appointmentId: formData.appointmentId ? parseInt(formData.appointmentId) : null,
        };
        await doctorService.createTreatment(treatmentData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save treatment');
    } finally {
      setLoading(false);
    }
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
          maxWidth: '700px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>{treatment ? 'Edit Treatment' : 'Add New Treatment'}</h2>
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

          <ErrorMessage message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit}>
            {appointment && (
                <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                  <div><strong>Patient:</strong> {appointment.patientName}</div>
                  <div><strong>Date:</strong> {formatDate(appointment.appointmentDate)}</div>
                  <div><strong>Time:</strong> {formatTime(appointment.appointmentTime)}</div>
                </div>
            )}

            {!treatment && !appointment && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Patient *
                  </label>
                  <select
                      name="patientId"
                      value={formData.patientId || ''}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.fullName} ({patient.email})
                        </option>
                    ))}
                  </select>
                </div>
            )}
        <form onSubmit={handleSubmit}>
          {appointment && (
            <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
              <div><strong>Patient:</strong> {appointment.patientName}</div>
              <div><strong>Date:</strong> {formatDate(appointment.appointmentDate)}</div>
              <div><strong>Time:</strong> {formatTime(appointment.appointmentTime)}</div>
            </div>
          )}
          
          {!treatment && !appointment && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Diagnosis
              </label>
              <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  rows="3"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Prescription
              </label>
              <textarea
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  rows="3"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Treatment Notes
              </label>
              <textarea
                  name="treatmentNotes"
                  value={formData.treatmentNotes}
                  onChange={handleChange}
                  rows="4"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Follow-up Date
              </label>
              <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                  type="button"
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
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
              >
                {loading ? 'Saving...' : treatment ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default TreatmentForm;