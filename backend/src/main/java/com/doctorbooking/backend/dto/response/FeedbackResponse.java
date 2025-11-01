package com.doctorbooking.backend.dto.response;

import com.doctorbooking.backend.model.Feedback;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long appointmentId;
    private Integer rating;
    private String comment;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FeedbackResponse fromEntity(Feedback feedback) {
        FeedbackResponse response = new FeedbackResponse();
        response.setId(feedback.getId());
        response.setPatientId(feedback.getPatient().getId());
        response.setPatientName(feedback.getPatient().getFullName());
        response.setAppointmentId(feedback.getAppointment() != null ? feedback.getAppointment().getId() : null);
        response.setRating(feedback.getRating());
        response.setComment(feedback.getComment());
        response.setStatus(feedback.getStatus().name());
        response.setCreatedAt(feedback.getCreatedAt());
        response.setUpdatedAt(feedback.getUpdatedAt());
        return response;
    }
}

