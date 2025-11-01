import { useEffect, useState } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { doctorService } from '../../services/doctorService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

const PatientSearch = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientTreatments, setPatientTreatments] = useState([]);
  const [loadingTreatments, setLoadingTreatments] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setPatients([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      searchPatients();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const searchPatients = async () => {
    try {
      setLoading(true);
      const data = await doctorService.searchPatients(searchTerm);
      setPatients(data);
      setError('');
    } catch (err) {
      setError('Failed to search patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setLoadingTreatments(true);
      const [patient, treatments] = await Promise.all([
        doctorService.getPatientById(id),
        doctorService.getPatientTreatments(id),
      ]);
      setSelectedPatient(patient);
      setPatientTreatments(treatments);
    } catch (err) {
      setError('Failed to load patient details');
      console.error(err);
    } finally {
      setLoadingTreatments(false);
    }
  };

  return (
    <DoctorLayout>
      <div>
        <h1 style={{ marginBottom: '20px' }}>Search Patients</h1>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Loading message="Searching..." />
          </div>
        )}

        {!loading && searchTerm && patients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
            <p>No patients found</p>
          </div>
        )}

        {!loading && patients.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date of Birth</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{patient.id}</td>
                    <td style={{ padding: '12px' }}>{patient.fullName}</td>
                    <td style={{ padding: '12px' }}>{patient.email}</td>
                    <td style={{ padding: '12px' }}>{patient.phone || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleViewDetails(patient.id)}
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

        {selectedPatient && (
          <PatientDetailModal
            patient={selectedPatient}
            treatments={patientTreatments}
            loadingTreatments={loadingTreatments}
            onClose={() => {
              setSelectedPatient(null);
              setPatientTreatments([]);
            }}
          />
        )}
      </div>
    </DoctorLayout>
  );
};

const PatientDetailModal = ({ patient, treatments, loadingTreatments, onClose }) => {
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
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Patient Details</h2>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
          <div><strong>ID:</strong> {patient.id}</div>
          <div><strong>Name:</strong> {patient.fullName}</div>
          <div><strong>Email:</strong> {patient.email}</div>
          <div><strong>Phone:</strong> {patient.phone || '-'}</div>
          <div><strong>Date of Birth:</strong> {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : '-'}</div>
          <div><strong>Gender:</strong> {patient.gender || '-'}</div>
          <div><strong>Address:</strong> {patient.address || '-'}</div>
          <div><strong>Emergency Contact:</strong> {patient.emergencyContact || '-'}</div>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px' }}>Treatment History (My Treatments)</h3>
          {loadingTreatments ? (
            <div>Loading treatments...</div>
          ) : treatments.length === 0 ? (
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              No treatments found
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '4px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}>
              {treatments.map((treatment) => (
                <div key={treatment.id} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #dee2e6' }}>
                  <div><strong>Date:</strong> {formatDate(treatment.createdAt)}</div>
                  {treatment.diagnosis && <div><strong>Diagnosis:</strong> {treatment.diagnosis}</div>}
                  {treatment.prescription && <div><strong>Prescription:</strong> {treatment.prescription}</div>}
                  {treatment.followUpDate && <div><strong>Follow-up:</strong> {formatDate(treatment.followUpDate)}</div>}
                </div>
              ))}
            </div>
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

export default PatientSearch;

