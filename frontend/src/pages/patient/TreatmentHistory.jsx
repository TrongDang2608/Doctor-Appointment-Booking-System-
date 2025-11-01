import { useEffect, useState } from 'react';
import PatientLayout from '../../components/patient/PatientLayout';
import { patientService } from '../../services/patientService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

const TreatmentHistory = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      const data = await patientService.getTreatments();
      setTreatments(data);
      setError('');
    } catch (err) {
      setError('Failed to load treatments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const treatment = await patientService.getTreatmentById(id);
      setSelectedTreatment(treatment);
    } catch (err) {
      setError('Failed to load treatment details');
      console.error(err);
    }
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
        <h1 style={{ marginBottom: '20px' }}>My Treatments</h1>

        <ErrorMessage message={error} onClose={() => setError('')} />

        {treatments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
            <p>No treatments found</p>
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
                  <th style={{ padding: '12px', textAlign: 'left' }}>Diagnosis</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Follow-up</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((treatment) => (
                  <tr key={treatment.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{treatment.doctorName}</td>
                    <td style={{ padding: '12px' }}>{formatDate(treatment.createdAt)}</td>
                    <td style={{ padding: '12px', maxWidth: '300px' }}>
                      {treatment.diagnosis || '-'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {treatment.followUpDate ? formatDate(treatment.followUpDate) : '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleViewDetails(treatment.id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTreatment && (
          <TreatmentDetailModal
            treatment={selectedTreatment}
            onClose={() => setSelectedTreatment(null)}
          />
        )}
      </div>
    </PatientLayout>
  );
};

const TreatmentDetailModal = ({ treatment, onClose }) => {
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
          <h2>Treatment Details</h2>
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
          <div><strong>Doctor:</strong> {treatment.doctorName}</div>
          <div><strong>Date:</strong> {formatDate(treatment.createdAt)}</div>
          {treatment.diagnosis && (
            <div>
              <strong>Diagnosis:</strong>
              <p style={{ marginTop: '5px', color: '#666', lineHeight: '1.6' }}>{treatment.diagnosis}</p>
            </div>
          )}
          {treatment.prescription && (
            <div>
              <strong>Prescription:</strong>
              <p style={{ marginTop: '5px', color: '#666', lineHeight: '1.6' }}>{treatment.prescription}</p>
            </div>
          )}
          {treatment.treatmentNotes && (
            <div>
              <strong>Treatment Notes:</strong>
              <p style={{ marginTop: '5px', color: '#666', lineHeight: '1.6' }}>{treatment.treatmentNotes}</p>
            </div>
          )}
          {treatment.followUpDate && (
            <div><strong>Follow-up Date:</strong> {formatDate(treatment.followUpDate)}</div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
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
      </div>
    </div>
  );
};

export default TreatmentHistory;

