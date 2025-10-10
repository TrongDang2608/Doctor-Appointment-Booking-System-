package com.doctorbooking.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Vô hiệu hóa CSRF vì chúng ta đang làm việc với API
                .csrf(csrf -> csrf.disable())
                // Cấu hình quy tắc cho các request HTTP
                .authorizeHttpRequests(auth -> auth
                        // Cho phép tất cả các request đến API bắt đầu bằng "/api/" mà không cần xác thực
                        .requestMatchers("/api/**").permitAll()
                        // Bất kỳ request nào khác đều yêu cầu xác thực
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}