package com.doctorbooking.backend.config;

import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * PlainTextPasswordEncoder - Chỉ dùng cho development/testing
 * KHÔNG sử dụng trong production!
 * 
 * So sánh password plain text (không hash)
 */
public class PlainTextPasswordEncoder implements PasswordEncoder {

    @Override
    public String encode(CharSequence rawPassword) {
        // Trả về plain text (không hash)
        return rawPassword.toString();
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        // So sánh plain text
        if (rawPassword == null || encodedPassword == null) {
            System.out.println("🔵 PlainTextPasswordEncoder.matches - Null check failed");
            return false;
        }
        
        String raw = rawPassword.toString();
        String encoded = encodedPassword;
        
        boolean matches = raw.equals(encoded);
        
        System.out.println("🔵 PlainTextPasswordEncoder.matches - Comparing:");
        System.out.println("   Raw password: '" + raw + "'");
        System.out.println("   Encoded password: '" + encoded + "'");
        System.out.println("   Matches: " + matches);
        
        return matches;
    }
}

