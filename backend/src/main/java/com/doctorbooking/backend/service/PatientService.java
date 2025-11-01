package com.doctorbooking.backend.service;

import com.doctorbooking.backend.dto.request.ChangePasswordRequest;
import com.doctorbooking.backend.dto.request.UpdatePatientProfileRequest;
import com.doctorbooking.backend.dto.response.PatientResponse;
import com.doctorbooking.backend.dto.response.TreatmentResponse;
import com.doctorbooking.backend.model.Patient;
import com.doctorbooking.backend.model.User;
import com.doctorbooking.backend.repository.PatientRepository;
import com.doctorbooking.backend.repository.TreatmentRepository;
import com.doctorbooking.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final TreatmentRepository treatmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<PatientResponse> searchPatients(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return patientRepository.findAll().stream()
                    .map(PatientResponse::fromEntity)
                    .collect(Collectors.toList());
        }
        return patientRepository.searchPatients(keyword).stream()
                .map(PatientResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public PatientResponse getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
        PatientResponse response = PatientResponse.fromEntity(patient);
        
        // Include treatments
        List<TreatmentResponse> treatments = treatmentRepository.findByPatientId(id).stream()
                .map(TreatmentResponse::fromEntity)
                .collect(Collectors.toList());
        response.setTreatments(treatments);
        
        return response;
    }

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(PatientResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Patient Profile Management (for patient themselves)
    public PatientResponse getPatientByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found with user id: " + userId));
        return PatientResponse.fromEntity(patient);
    }

    @Transactional
    public PatientResponse updatePatientProfile(Long userId, UpdatePatientProfileRequest request) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found with user id: " + userId));

        if (request.getFullName() != null) {
            patient.setFullName(request.getFullName());
        }
        if (request.getDateOfBirth() != null) {
            patient.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getGender() != null) {
            try {
                patient.setGender(Patient.Gender.valueOf(request.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid gender: " + request.getGender());
            }
        }
        if (request.getPhone() != null) {
            patient.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            patient.setAddress(request.getAddress());
        }
        if (request.getEmergencyContact() != null) {
            patient.setEmergencyContact(request.getEmergencyContact());
        }
        if (request.getEmergencyPhone() != null) {
            patient.setEmergencyPhone(request.getEmergencyPhone());
        }

        patient = patientRepository.save(patient);
        return PatientResponse.fromEntity(patient);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Verify current password (plain text comparison)
        if (!request.getCurrentPassword().equals(user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update password (plain text - tạm thời)
        user.setPassword(request.getNewPassword()); // Plain text
        // user.setPassword(passwordEncoder.encode(request.getNewPassword())); // BCrypt - uncomment sau khi test xong
        userRepository.save(user);
    }
}

