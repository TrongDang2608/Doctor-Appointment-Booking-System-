package com.doctorbooking.backend.controller;

import com.doctorbooking.backend.model.User;
import com.doctorbooking.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final UserRepository userRepository;

    @GetMapping("/auth-info")
    public ResponseEntity<Map<String, Object>> getAuthInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> info = new HashMap<>();
        
        if (authentication != null) {
            info.put("authenticated", true);
            info.put("username", authentication.getName());
            info.put("authorities", authentication.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .collect(Collectors.toList()));
            info.put("principal", authentication.getPrincipal().getClass().getName());
        } else {
            info.put("authenticated", false);
        }
        
        return ResponseEntity.ok(info);
    }

    @GetMapping("/db-check")
    public ResponseEntity<Map<String, Object>> checkDatabase() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Check connection
            long userCount = userRepository.count();
            result.put("connected", true);
            result.put("totalUsers", userCount);
            
            // Get all users (without password)
            List<Map<String, Object>> users = userRepository.findAll().stream()
                    .map(user -> {
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("username", user.getUsername());
                        userMap.put("email", user.getEmail());
                        userMap.put("role", user.getRole().name());
                        userMap.put("enabled", user.getEnabled());
                        return userMap;
                    })
                    .collect(Collectors.toList());
            
            result.put("users", users);
            result.put("message", "Database connection successful");
            
        } catch (Exception e) {
            result.put("connected", false);
            result.put("error", e.getMessage());
            result.put("message", "Database connection failed");
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUserByUsername(@RequestParam String username) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            User user = userRepository.findByUsername(username)
                    .orElse(userRepository.findByEmail(username).orElse(null));
            
            if (user != null) {
                result.put("found", true);
                result.put("id", user.getId());
                result.put("username", user.getUsername());
                result.put("email", user.getEmail());
                result.put("role", user.getRole().name());
                result.put("enabled", user.getEnabled());
                result.put("hasPassword", user.getPassword() != null && !user.getPassword().isEmpty());
            } else {
                result.put("found", false);
                result.put("message", "User not found with username/email: " + username);
            }
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/auth-check")
    public ResponseEntity<Map<String, Object>> checkAuthentication() {
        Map<String, Object> result = new HashMap<>();
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null) {
            result.put("authenticated", true);
            result.put("name", authentication.getName());
            result.put("principal", authentication.getPrincipal().getClass().getName());
            
            List<String> authorities = authentication.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .collect(Collectors.toList());
            result.put("authorities", authorities);
            
            // Check if principal is User entity
            if (authentication.getPrincipal() instanceof User) {
                User user = (User) authentication.getPrincipal();
                result.put("userEntity", true);
                result.put("userId", user.getId());
                result.put("username", user.getUsername());
                result.put("email", user.getEmail());
                result.put("role", user.getRole().name());
            } else {
                result.put("userEntity", false);
            }
        } else {
            result.put("authenticated", false);
            result.put("message", "No authentication found in SecurityContext");
        }
        
        return ResponseEntity.ok(result);
    }
}
