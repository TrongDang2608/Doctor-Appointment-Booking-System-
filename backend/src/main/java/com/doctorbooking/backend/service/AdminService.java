package com.doctorbooking.backend.service;

import com.doctorbooking.backend.dto.request.DoctorRequest;
import com.doctorbooking.backend.dto.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final DoctorService doctorService;
    private final PatientService patientService;
    private final AppointmentService appointmentService;
    private final FeedbackService feedbackService;

    // Doctor Management
    public List<DoctorResponse> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    public List<DoctorResponse> searchDoctors(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllDoctors();
        }
        return doctorService.searchDoctors(keyword);
    }

    public DoctorResponse getDoctorById(Long id) {
        return doctorService.getDoctorById(id);
    }

    public DoctorResponse createDoctor(DoctorRequest request) {
        return doctorService.createDoctor(request);
    }

    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {
        return doctorService.updateDoctor(id, request);
    }

    public void deleteDoctor(Long id) {
        doctorService.deleteDoctor(id);
    }

    // Patient Management
    public List<PatientResponse> searchPatients(String keyword) {
        return patientService.searchPatients(keyword);
    }

    public PatientResponse getPatientById(Long id) {
        return patientService.getPatientById(id);
    }

    // Appointment Management
    public List<AppointmentResponse> getAllAppointments(LocalDate date) {
        if (date != null) {
            return appointmentService.getAppointmentsByDate(date);
        }
        return appointmentService.getAllAppointments();
    }

    public AppointmentResponse getAppointmentById(Long id) {
        return appointmentService.getAppointmentById(id);
    }

    // Feedback Management
    public List<FeedbackResponse> getAllFeedbacks(String status) {
        return feedbackService.getFeedbacksByStatus(status);
    }

    public FeedbackResponse getFeedbackById(Long id) {
        return feedbackService.getFeedbackById(id);
    }

    public FeedbackResponse markFeedbackAsRead(Long id) {
        return feedbackService.markFeedbackAsRead(id);
    }
}

