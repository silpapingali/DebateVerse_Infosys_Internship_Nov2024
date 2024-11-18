package com.server.debateverse.services.Implementation;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.server.debateverse.entities.EmailDetails;
import com.server.debateverse.entities.Token;
import com.server.debateverse.entities.User;
import com.server.debateverse.repositories.TokenRepo;
import com.server.debateverse.repositories.UserRepo;
import com.server.debateverse.services.AuthService;
import com.server.debateverse.services.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    private final TokenRepo tokenRepo;

    private final EmailService emailService;

    @Override
    public Map<String, Object> createUser(User user) {
        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new RuntimeException("Invalid email format");
        }
        if (user.getPassword().length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long");
        }

        User newUser = new User();
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setEmail(user.getEmail());
        newUser.setRole(User.Role.USER);
        newUser.setEnabled(false);

        User savedUser = userRepo.save(newUser);

        // Generate Token
        String token = UUID.randomUUID().toString();
        Token verificationToken = new Token();
        verificationToken.setToken(token);
        verificationToken.setUser(savedUser);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        tokenRepo.save(verificationToken);

        // Send Email
        String verificationLink = "http://localhost:4200/verify-email?token=" + token;
        return emailService
                .sendSimpleMail(new EmailDetails(savedUser.getEmail(), verificationLink, "Email Verification"));
    }

    @Override
    public Map<String, Object> generatePasswordResetToken(String email) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        Token resetToken = new Token();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepo.save(resetToken);

        String resetLink = "http://localhost:4200/reset-password?token=" + token;

        return emailService.sendSimpleMail(new EmailDetails(email, resetLink, "Password Reset"));
    }
}
