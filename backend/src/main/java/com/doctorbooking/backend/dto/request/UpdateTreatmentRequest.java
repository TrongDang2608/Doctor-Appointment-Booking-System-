package com.doctorbooking.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTreatmentRequest {
    private String diagnosis;
    private String prescription;
    private String treatmentNotes;
    private LocalDate followUpDate;
}

