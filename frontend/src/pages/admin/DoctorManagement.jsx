import { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import DataTable from '../../components/common/DataTable';
import DoctorForm from '../../components/admin/DoctorForm';

const DoctorManagement = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    loadAllDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    if (searchTerm.trim() === '') {
      return allDoctors;
    }
    const term = searchTerm.toLowerCase();
    return allDoctors.filter(doctor => 
      doctor.fullName?.toLowerCase().includes(term) ||
      doctor.specialization?.toLowerCase().includes(term) ||
      doctor.email?.toLowerCase().includes(term)
    );
  }, [searchTerm, allDoctors]);

  useEffect(() => {
    setDoctors(filteredDoctors);
  }, [filteredDoctors]);

  const loadAllDoctors = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllDoctors('');
      setAllDoctors(data);
      setError('');
    } catch (err) {
      setError('Failed to load doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDoctor(null);
    setShowForm(true);
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      await adminService.deleteDoctor(id);
      loadAllDoctors();
      setError('');
    } catch (err) {
      setError('Failed to delete doctor');
      console.error(err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDoctor(null);
    loadAllDoctors();
  };

  if (loading && doctors.length === 0) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#2c3e50', margin: 0 }}>
            Doctor Management
          </h1>
          <button
            onClick={handleCreate}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
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
            + Add Doctor
          </button>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search doctors by name, specialization, or email..."
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

        {showForm && (
          <DoctorForm
            doctor={editingDoctor}
            onClose={handleFormClose}
            onSuccess={handleFormClose}
          />
        )}

        <DataTable
          columns={[
            { header: 'Name', accessor: 'fullName' },
            { header: 'Specialization', accessor: 'specialization' },
            { header: 'Email', accessor: 'email' },
            { 
              header: 'Phone', 
              accessor: 'phone',
              render: (doctor) => doctor.phone || '-'
            },
            {
              header: 'Status',
              accessor: 'status',
              render: (doctor) => (
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  backgroundColor: doctor.status === 'ACTIVE' ? '#d4edda' : '#f8d7da',
                  color: doctor.status === 'ACTIVE' ? '#155724' : '#721c24',
                  fontSize: '12px',
                  fontWeight: '500',
                }}>
                  {doctor.status}
                </span>
              )
            },
            {
              header: 'Actions',
              align: 'center',
              render: (doctor) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(doctor);
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doctor.id);
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
                    Delete
                  </button>
                </div>
              )
            }
          ]}
          data={doctors}
          loading={loading && doctors.length === 0}
          emptyMessage={searchTerm ? `No doctors found matching "${searchTerm}"` : 'No doctors found'}
        />
      </div>
    </AdminLayout>
  );
};

export default DoctorManagement;

