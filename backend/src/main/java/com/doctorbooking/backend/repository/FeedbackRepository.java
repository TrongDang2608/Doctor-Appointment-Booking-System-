package com.doctorbooking.backend.repository;

import com.doctorbooking.backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByPatientId(Long patientId);
    List<Feedback> findByStatus(Feedback.FeedbackStatus status);
}

