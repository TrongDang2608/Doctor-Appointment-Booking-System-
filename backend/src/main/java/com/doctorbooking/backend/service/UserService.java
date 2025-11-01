package com.doctorbooking.backend.service;

import com.doctorbooking.backend.model.User;
import com.doctorbooking.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        System.out.println("🔵 UserService.loadUserByUsername - Searching for: " + usernameOrEmail);
        
        // Try to find by username first, if not found, try email
        User user = userRepository.findByUsername(usernameOrEmail)
                .orElse(userRepository.findByEmail(usernameOrEmail)
                        .orElse(null));
        
        if (user != null) {
            System.out.println("✅ UserService.loadUserByUsername - Found user: " + user.getUsername() + " (ID: " + user.getId() + ", Role: " + user.getRole() + ")");
            return user;
        } else {
            System.err.println("❌ UserService.loadUserByUsername - User not found with username or email: " + usernameOrEmail);
            // Debug: List all usernames and emails
            long totalUsers = userRepository.count();
            System.err.println("❌ Total users in database: " + totalUsers);
            if (totalUsers > 0) {
                userRepository.findAll().forEach(u -> 
                    System.err.println("   - Username: '" + u.getUsername() + "', Email: '" + u.getEmail() + "', Role: " + u.getRole())
                );
            }
            throw new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail);
        }
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}

