package com.doctorbooking.backend.config;

import com.doctorbooking.backend.model.Admin;
import com.doctorbooking.backend.model.User;
import com.doctorbooking.backend.repository.AdminRepository;
import com.doctorbooking.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        String adminUsername = "admin";
        String adminPassword = "admin123";
        String adminEmail = "admin@hospital.com";

        try {
            User adminUser = userRepository.findByUsername(adminUsername).orElse(null);
            boolean needsUpdate = false;

            if (adminUser == null) {
                // Tạo User mới với role ADMIN
                log.info("Creating default admin user...");
                adminUser = new User();
                adminUser.setUsername(adminUsername);
                adminUser.setEmail(adminEmail);
                adminUser.setRole(User.Role.ADMIN);
                adminUser.setEnabled(true);
                adminUser.setCreatedAt(LocalDateTime.now());
                adminUser.setPassword(passwordEncoder.encode(adminPassword));
                needsUpdate = true;
            } else {
                // Kiểm tra và update password nếu cần
                log.info("Admin user exists. Verifying password...");
                
                // Kiểm tra password hiện tại có đúng không (plain text comparison)
                if (!adminPassword.equals(adminUser.getPassword())) {
                    log.warn("Admin password mismatch. Resetting to default password...");
                    // Tạm thời dùng plain text password (KHÔNG hash)
                    adminUser.setPassword(adminPassword); // Plain text
                    // adminUser.setPassword(passwordEncoder.encode(adminPassword)); // BCrypt - uncomment sau khi test xong
                    adminUser.setUpdatedAt(LocalDateTime.now());
                    needsUpdate = true;
                }
                
                // Đảm bảo role là ADMIN
                if (adminUser.getRole() != User.Role.ADMIN) {
                    log.warn("Admin user role incorrect. Fixing role...");
                    adminUser.setRole(User.Role.ADMIN);
                    adminUser.setUpdatedAt(LocalDateTime.now());
                    needsUpdate = true;
                }
                
                // Đảm bảo enabled
                if (!adminUser.getEnabled()) {
                    log.warn("Admin user disabled. Enabling...");
                    adminUser.setEnabled(true);
                    adminUser.setUpdatedAt(LocalDateTime.now());
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                adminUser = userRepository.save(adminUser);
                log.info("Admin user saved/updated.");
            }

            // Kiểm tra và tạo Admin record nếu chưa có
            if (adminRepository.findByUserId(adminUser.getId()).isEmpty()) {
                log.info("Creating admin profile...");
                Admin admin = new Admin();
                admin.setUser(adminUser);
                admin.setFullName("System Administrator");
                admin.setPhone("0123456789");
                admin.setCreatedAt(LocalDateTime.now());
                admin.setUpdatedAt(LocalDateTime.now());
                adminRepository.save(admin);
                log.info("Admin profile created successfully!");
            } else {
                log.info("Admin profile already exists.");
            }

            // Verify user was saved correctly
            User verifiedUser = userRepository.findByUsername(adminUsername)
                    .orElse(userRepository.findByEmail(adminEmail).orElse(null));
            
            if (verifiedUser != null) {
                log.info("✅ Admin user verified in database!");
                log.info("   ID: {}", verifiedUser.getId());
                log.info("   Username: {}", verifiedUser.getUsername());
                log.info("   Email: {}", verifiedUser.getEmail());
                log.info("   Role: {}", verifiedUser.getRole());
                log.info("   Enabled: {}", verifiedUser.getEnabled());
            } else {
                log.error("❌ CRITICAL: Admin user was saved but cannot be retrieved from database!");
            }
            
            log.info("✅ Admin user ready!");
            log.info("   Username: {}", adminUsername);
            log.info("   Email: {}", adminEmail);
            log.info("   Password: {}", adminPassword);

        } catch (Exception e) {
            log.error("❌ Failed to initialize admin user: {}", e.getMessage(), e);
            e.printStackTrace();
        }
    }
}

