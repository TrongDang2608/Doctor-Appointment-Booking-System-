package com.doctorbooking.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String fullName;
    private String specialization;
    private String qualification;
    private Integer experience;
    private String phone;
    private String address;
    private String bio;
}

