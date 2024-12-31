package com.server.debateverse.services;

import java.util.List;

import com.server.debateverse.entities.User;

public interface UserService {

    List<User> getAllUsers();

    void blockUser(Long userId);

    void unblockUser(Long userId);
}
