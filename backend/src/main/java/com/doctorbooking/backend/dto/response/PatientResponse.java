package com.doctorbooking.backend.dto.response;

import com.doctorbooking.backend.model.Patient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String phone;
    private String address;
    private String emergencyContact;
    private String emergencyPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TreatmentResponse> treatments; // Optional, only included when needed

    public static PatientResponse fromEntity(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.setId(patient.getId());
        response.setUserId(patient.getUser().getId());
        response.setUsername(patient.getUser().getUsername());
        response.setEmail(patient.getUser().getEmail());
        response.setFullName(patient.getFullName());
        response.setDateOfBirth(patient.getDateOfBirth());
        response.setGender(patient.getGender() != null ? patient.getGender().name() : null);
        response.setPhone(patient.getPhone());
        response.setAddress(patient.getAddress());
        response.setEmergencyContact(patient.getEmergencyContact());
        response.setEmergencyPhone(patient.getEmergencyPhone());
        response.setCreatedAt(patient.getCreatedAt());
        response.setUpdatedAt(patient.getUpdatedAt());
        return response;
    }
}

