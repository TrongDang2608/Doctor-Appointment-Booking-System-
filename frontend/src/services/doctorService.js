import api from '../config/api';

export const doctorService = {
  // Profile Management
  getProfile: async () => {
    const response = await api.get('/doctor/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/doctor/profile', profileData);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    await api.post('/doctor/change-password', { currentPassword, newPassword });
  },

  // Appointments
  getAppointments: async (date) => {
    const params = date ? { date } : {};
    const response = await api.get('/doctor/appointments', { params });
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/doctor/appointments/${id}`);
    return response.data;
  },

  // Treatments
  getTreatments: async () => {
    const response = await api.get('/doctor/treatments');
    return response.data;
  },

  getTreatmentById: async (id) => {
    const response = await api.get(`/doctor/treatments/${id}`);
    return response.data;
  },

  createTreatment: async (treatmentData) => {
    const response = await api.post('/doctor/treatments', treatmentData);
    return response.data;
  },

  updateTreatment: async (id, treatmentData) => {
    const response = await api.put(`/doctor/treatments/${id}`, treatmentData);
    return response.data;
  },

  deleteTreatment: async (id) => {
    await api.delete(`/doctor/treatments/${id}`);
  },

  // Patients
  searchPatients: async (search) => {
    const params = search ? { search } : {};
    const response = await api.get('/doctor/patients', { params });
    return response.data;
  },

  getPatientById: async (id) => {
    const response = await api.get(`/doctor/patients/${id}`);
    return response.data;
  },

  getPatientTreatments: async (patientId) => {
    const response = await api.get(`/doctor/patients/${patientId}/treatments`);
    return response.data;
  },
};

