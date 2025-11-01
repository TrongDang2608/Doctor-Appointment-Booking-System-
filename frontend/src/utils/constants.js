export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api';

export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const DOCTOR_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const FEEDBACK_STATUS = {
  PENDING: 'PENDING',
  READ: 'READ',
};

