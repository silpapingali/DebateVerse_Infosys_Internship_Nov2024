package com.server.debateverse.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.debateverse.configuration.CustomUserDetailService;
import com.server.debateverse.entities.JwtRequest;
import com.server.debateverse.entities.JwtResponse;
import com.server.debateverse.entities.Token;
import com.server.debateverse.entities.User;
import com.server.debateverse.repositories.TokenRepo;
import com.server.debateverse.repositories.UserRepo;
import com.server.debateverse.services.AuthService;
import com.server.debateverse.util.JwtTokenHelper;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final JwtTokenHelper jwtTokenHelper;

    private final AuthenticationManager authenticationManager;

    private final CustomUserDetailService customUserDetailService;

    private final AuthService authService;

    private final TokenRepo tokenRepo;

    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    private void authenticate(String username, String password) throws Exception {
        // First check if the user exists in the database
        User user = customUserDetailService.getUserByEmail(username); // Assuming this method checks if the user exists
        if (user == null) {
            throw new UsernameNotFoundException("User not found!"); // User not found, throw an exception
        }
        if (!user.isEnabled()) {
            throw new DisabledException("User is disabled!"); // User is disabled, throw an exception
        }

        // Now proceed with authentication if the user exists
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid credentials!"); // Handle bad credentials
        }
    }

    @PostMapping("/generate-token")
    public ResponseEntity<?> generateToken(@RequestBody JwtRequest jwtRequest) throws Exception {
        // Validate fields in the request body
        if (jwtRequest.getEmail() == null || jwtRequest.getEmail().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (jwtRequest.getPassword() == null || jwtRequest.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        try {
            // Authenticate the user
            System.out.println("Authenticating");
            authenticate(jwtRequest.getEmail(), jwtRequest.getPassword());
            System.out.println("Authenticated");

            final UserDetails userDetails = customUserDetailService.loadUserByUsername(jwtRequest.getEmail());
            User user = customUserDetailService.getUserByEmail(jwtRequest.getEmail());
            final String token = jwtTokenHelper.generateToken(userDetails);

            return ResponseEntity.ok(new JwtResponse(token, user, "Success"));
        } catch (UsernameNotFoundException e) {
            // Handle UsernameNotFoundException (user not found)
            throw new RuntimeException("User not found! Please register.");
        } catch (DisabledException e) {
            // Handle DisabledException (user is disabled)
            throw new RuntimeException("User is disabled! Please verify your email.");
        } catch (BadCredentialsException e) {
            // Handle BadCredentialsException (invalid credentials)
            throw new RuntimeException("Invalid credentials! Please try again.");
        } catch (Exception e) {
            // Catch any other exceptions
            throw new RuntimeException("An error occurred while generating token.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        Optional<User> existingUser = userRepo.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with email already exists.");
        }
        return ResponseEntity.ok(authService.createUser(user));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        System.out.println(token);
        Token verificationToken = tokenRepo.findByToken(token);
        if (verificationToken == null || verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired token.");
        }
        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepo.save(user);
        tokenRepo.delete(verificationToken); // Remove the token after successful verification
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Email successfully verified.");
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        return ResponseEntity.ok(authService.generatePasswordResetToken(email));
    }

    @GetMapping("/reset-password")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        Token resetToken = tokenRepo.findByToken(token);
        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired token.");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Valid token. Proceed to reset password.");
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Token resetToken = tokenRepo.findByToken(token);

        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired token.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        tokenRepo.delete(resetToken); // Remove the token after successful password reset
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Password reset successful.");
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-user")
    public ResponseEntity<?> getUser(@RequestParam Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println(user);
        return ResponseEntity.ok(user);
        

    }

}