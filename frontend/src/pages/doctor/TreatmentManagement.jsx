import { useEffect, useState } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { doctorService } from '../../services/doctorService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import TreatmentForm from '../../components/doctor/TreatmentForm';
import { formatDate } from '../../utils/formatDate';

const TreatmentManagement = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getTreatments();
      setTreatments(data);
      setError('');
    } catch (err) {
      setError('Failed to load treatments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTreatment(null);
    setShowForm(true);
  };

  const handleEdit = (treatment) => {
    setEditingTreatment(treatment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this treatment?')) {
      return;
    }

    try {
      await doctorService.deleteTreatment(id);
      loadTreatments();
      setError('');
    } catch (err) {
      setError('Failed to delete treatment');
      console.error(err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTreatment(null);
    loadTreatments();
  };

  if (loading && treatments.length === 0) {
    return (
      <DoctorLayout>
        <Loading />
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Treatment Management</h1>
          <button
            onClick={handleCreate}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            + Add Treatment
          </button>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        {showForm && (
          <TreatmentForm
            treatment={editingTreatment}
            onClose={handleFormClose}
            onSuccess={handleFormClose}
          />
        )}

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
                  <th style={{ padding: '12px', textAlign: 'left' }}>Patient</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Diagnosis</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Follow-up</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((treatment) => (
                  <tr key={treatment.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{treatment.patientName}</td>
                    <td style={{ padding: '12px', maxWidth: '300px' }}>
                      {treatment.diagnosis || '-'}
                    </td>
                    <td style={{ padding: '12px' }}>{formatDate(treatment.createdAt)}</td>
                    <td style={{ padding: '12px' }}>
                      {treatment.followUpDate ? formatDate(treatment.followUpDate) : '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(treatment)}
                        style={{
                          padding: '5px 10px',
                          marginRight: '5px',
                          backgroundColor: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(treatment.id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
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

export default TreatmentManagement;

