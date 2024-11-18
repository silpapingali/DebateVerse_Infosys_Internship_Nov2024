package com.server.debateverse.services;

import java.util.Map;

import com.server.debateverse.entities.EmailDetails;

public interface EmailService {
    Map<String, Object> sendSimpleMail(EmailDetails details);
}
