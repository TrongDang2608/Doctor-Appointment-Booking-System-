package com.doctorbooking.backend.repository;

import com.doctorbooking.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByAppointmentDate(LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND " +
           "a.appointmentDate = :date AND a.appointmentTime = :time AND " +
           "a.status != 'CANCELLED'")
    Optional<Appointment> findExistingAppointment(
        @Param("doctorId") Long doctorId,
        @Param("date") LocalDate date,
        @Param("time") LocalTime time
    );
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND " +
           "a.appointmentDate = :date")
    List<Appointment> findByDoctorAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByPatientIdOrderByDateDesc(@Param("patientId") Long patientId);
}

