package com.doctorbooking.backend.repository;

import com.doctorbooking.backend.model.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, Long> {
    List<Treatment> findByPatientId(Long patientId);
    List<Treatment> findByDoctorId(Long doctorId);
    List<Treatment> findByAppointmentId(Long appointmentId);
}

