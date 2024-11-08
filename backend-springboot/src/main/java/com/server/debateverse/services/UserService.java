package com.server.debateverse.services;

import java.util.List;

import com.server.debateverse.entities.User;

public interface UserService {
    public User createUser(User user);
    public String deleteUser(Long id);
    public User updateUser(User user, Long id);
    public User getUser(Long id);
    public List<User> getAllUsers();
}
