import api from '../config/api';

export const adminService = {
  // Doctor Management
  getAllDoctors: async (search) => {
    const params = search ? { search } : {};
    const response = await api.get('/admin/doctors', { params });
    return response.data;
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/admin/doctors/${id}`);
    return response.data;
  },

  createDoctor: async (doctorData) => {
    const response = await api.post('/admin/doctors', doctorData);
    return response.data;
  },

  updateDoctor: async (id, doctorData) => {
    const response = await api.put(`/admin/doctors/${id}`, doctorData);
    return response.data;
  },

  deleteDoctor: async (id) => {
    await api.delete(`/admin/doctors/${id}`);
  },

  // Patient Management
  searchPatients: async (search) => {
    const params = search ? { search } : {};
    const response = await api.get('/admin/patients', { params });
    return response.data;
  },

  getPatientById: async (id) => {
    const response = await api.get(`/admin/patients/${id}`);
    return response.data;
  },

  // Appointment Management
  getAllAppointments: async (date) => {
    const params = date ? { date } : {};
    const response = await api.get('/admin/appointments', { params });
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/admin/appointments/${id}`);
    return response.data;
  },

  // Feedback Management
  getAllFeedbacks: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/admin/feedbacks', { params });
    return response.data;
  },

  getFeedbackById: async (id) => {
    const response = await api.get(`/admin/feedbacks/${id}`);
    return response.data;
  },

  markFeedbackAsRead: async (id) => {
    const response = await api.put(`/admin/feedbacks/${id}/read`);
    return response.data;
  },
};

