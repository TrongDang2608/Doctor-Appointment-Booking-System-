package com.doctorbooking.backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class to generate BCrypt password hashes
 * Run this as a standalone main method to generate password hash
 */
public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin123";
        String hashedPassword = encoder.encode(rawPassword);
        System.out.println("Password: " + rawPassword);
        System.out.println("BCrypt Hash: " + hashedPassword);
        
        // Verify the hash
        boolean matches = encoder.matches(rawPassword, hashedPassword);
        System.out.println("Verification: " + matches);
    }
}

