import { useEffect, useState, useMemo } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { doctorService } from '../../services/doctorService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import DataTable from '../../components/common/DataTable';
import { formatDate } from '../../utils/formatDate';

const PatientSearch = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientTreatments, setPatientTreatments] = useState([]);
  const [loadingTreatments, setLoadingTreatments] = useState(false);

  // Load all patients on mount
  useEffect(() => {
    loadAllPatients();
  }, []);

  // Filter patients when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setPatients(allPatients);
    } else {
      const delayDebounce = setTimeout(() => {
        const filtered = allPatients.filter(patient => 
          patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.id?.toString().includes(searchTerm) ||
          patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setPatients(filtered);
      }, 300);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, allPatients]);

  const loadAllPatients = async () => {
    try {
      setLoading(true);
      // Load all patients with empty search
      const data = await doctorService.searchPatients('');
      setAllPatients(data);
      setPatients(data);
      setError('');
    } catch (err) {
      setError('Failed to load patients');
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
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: '600', color: '#2c3e50' }}>
          Search Patients
        </h1>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search patients by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        {loading && patients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Loading message="Loading patients..." />
          </div>
        )}

        {!loading && searchTerm && patients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
            <p>No patients found matching "{searchTerm}"</p>
          </div>
        )}

        {!loading && !searchTerm && patients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
            <p>No patients found</p>
          </div>
        )}

        <DataTable
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Name', accessor: 'fullName' },
            { header: 'Email', accessor: 'email' },
            { 
              header: 'Phone', 
              accessor: 'phone',
              render: (patient) => patient.phone || '-'
            },
            { 
              header: 'Date of Birth', 
              accessor: 'dateOfBirth',
              render: (patient) => patient.dateOfBirth ? formatDate(patient.dateOfBirth) : '-'
            },
            {
              header: 'Actions',
              align: 'center',
              render: (patient) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(patient.id);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                >
                  View Details
                </button>
              )
            }
          ]}
          data={patients}
          loading={loading && patients.length === 0}
          emptyMessage={searchTerm ? `No patients found matching "${searchTerm}"` : 'No patients found'}
        />

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

