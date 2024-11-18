package com.server.debateverse.services;

import java.util.Map;

import com.server.debateverse.entities.User;

public interface AuthService {
    public Map<String, Object> createUser(User user);
    public Map<String, Object> generatePasswordResetToken(String email);
}
