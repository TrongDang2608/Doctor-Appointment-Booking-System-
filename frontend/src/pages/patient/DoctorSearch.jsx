import { useEffect, useState } from 'react';
import PatientLayout from '../../components/patient/PatientLayout';
import { patientService } from '../../services/patientService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import DoctorDetail from '../../components/patient/DoctorDetail';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      loadDoctors();
      return;
    }
    const delayDebounce = setTimeout(() => {
      searchDoctors();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await patientService.searchDoctors('');
      setDoctors(data);
      setError('');
    } catch (err) {
      setError('Failed to load doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchDoctors = async () => {
    try {
      setLoading(true);
      const data = await patientService.searchDoctors(searchTerm);
      setDoctors(data);
      setError('');
    } catch (err) {
      setError('Failed to search doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const doctor = await patientService.getDoctorById(id);
      setSelectedDoctor(doctor);
    } catch (err) {
      setError('Failed to load doctor details');
      console.error(err);
    }
  };

  return (
    <PatientLayout>
      <div>
        <h1 style={{ marginBottom: '20px' }}>Find Doctors</h1>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by doctor name or specialization..."
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

        {loading && doctors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Loading message="Loading doctors..." />
          </div>
        )}

        {!loading && doctors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
            <p>No doctors found</p>
          </div>
        )}

        {!loading && doctors.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0',
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#3498db' }}>
                  Dr. {doctor.fullName}
                </h3>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  <strong>Specialization:</strong> {doctor.specialization}
                </p>
                {doctor.qualification && (
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    {doctor.qualification}
                  </p>
                )}
                {doctor.experience > 0 && (
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    {doctor.experience} years of experience
                  </p>
                )}
                {doctor.phone && (
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    📞 {doctor.phone}
                  </p>
                )}
                <button
                  onClick={() => handleViewDetails(doctor.id)}
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedDoctor && (
          <DoctorDetail
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
      </div>
    </PatientLayout>
  );
};

export default DoctorSearch;

