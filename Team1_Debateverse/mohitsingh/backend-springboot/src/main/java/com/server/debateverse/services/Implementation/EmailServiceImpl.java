package com.server.debateverse.services.Implementation;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.server.debateverse.entities.EmailDetails;
import com.server.debateverse.services.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public Map<String, Object> sendSimpleMail(EmailDetails details) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Creating a simple mail message
            SimpleMailMessage mailMessage = new SimpleMailMessage();
    
            // Setting up necessary details
            mailMessage.setFrom(sender);
            mailMessage.setTo(details.getRecipient());
            mailMessage.setText(details.getMsgBody());
            mailMessage.setSubject(details.getSubject());
    
            // Sending the mail
            javaMailSender.send(mailMessage);
    
            // Success response
            response.put("message", "Email sent successfully!");
            response.put("success", true);
        } catch (Exception e) {
            // Error response
            response.put("message", "Email sending failed!");
            response.put("success", false);
            // Optional: Log the exception for debugging
            e.printStackTrace();
        }
        return response;
    }
    

}
