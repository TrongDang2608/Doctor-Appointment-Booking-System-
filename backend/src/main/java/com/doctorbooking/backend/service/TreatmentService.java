package com.doctorbooking.backend.service;

import com.doctorbooking.backend.dto.request.CreateTreatmentRequest;
import com.doctorbooking.backend.dto.request.UpdateTreatmentRequest;
import com.doctorbooking.backend.dto.response.TreatmentResponse;
import com.doctorbooking.backend.model.Appointment;
import com.doctorbooking.backend.model.Doctor;
import com.doctorbooking.backend.model.Patient;
import com.doctorbooking.backend.model.Treatment;
import com.doctorbooking.backend.repository.AppointmentRepository;
import com.doctorbooking.backend.repository.DoctorRepository;
import com.doctorbooking.backend.repository.PatientRepository;
import com.doctorbooking.backend.repository.TreatmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreatmentService {

    private final TreatmentRepository treatmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public List<TreatmentResponse> getAllTreatments() {
        return treatmentRepository.findAll().stream()
                .map(TreatmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TreatmentResponse> getTreatmentsByDoctorId(Long doctorId) {
        return treatmentRepository.findByDoctorId(doctorId).stream()
                .map(TreatmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TreatmentResponse> getTreatmentsByPatientId(Long patientId) {
        return treatmentRepository.findByPatientId(patientId).stream()
                .map(TreatmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public TreatmentResponse getTreatmentById(Long id) {
        Treatment treatment = treatmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Treatment not found with id: " + id));
        return TreatmentResponse.fromEntity(treatment);
    }

    @Transactional
    public TreatmentResponse createTreatment(Long doctorId, CreateTreatmentRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + request.getPatientId()));

        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElse(null); // Appointment is optional
        }

        Treatment treatment = new Treatment();
        treatment.setDoctor(doctor);
        treatment.setPatient(patient);
        treatment.setAppointment(appointment);
        treatment.setDiagnosis(request.getDiagnosis());
        treatment.setPrescription(request.getPrescription());
        treatment.setTreatmentNotes(request.getTreatmentNotes());
        treatment.setFollowUpDate(request.getFollowUpDate());

        treatment = treatmentRepository.save(treatment);
        
        // If treatment is created for an appointment, mark appointment as COMPLETED
        if (appointment != null && appointment.getStatus() == Appointment.AppointmentStatus.CONFIRMED) {
            appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
            appointmentRepository.save(appointment);
        }
        
        return TreatmentResponse.fromEntity(treatment);
    }

    @Transactional
    public TreatmentResponse updateTreatment(Long id, UpdateTreatmentRequest request) {
        Treatment treatment = treatmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Treatment not found with id: " + id));

        if (request.getDiagnosis() != null) {
            treatment.setDiagnosis(request.getDiagnosis());
        }
        if (request.getPrescription() != null) {
            treatment.setPrescription(request.getPrescription());
        }
        if (request.getTreatmentNotes() != null) {
            treatment.setTreatmentNotes(request.getTreatmentNotes());
        }
        if (request.getFollowUpDate() != null) {
            treatment.setFollowUpDate(request.getFollowUpDate());
        }

        treatment = treatmentRepository.save(treatment);
        return TreatmentResponse.fromEntity(treatment);
    }

    @Transactional
    public void deleteTreatment(Long id) {
        Treatment treatment = treatmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Treatment not found with id: " + id));
        treatmentRepository.delete(treatment);
    }
}

