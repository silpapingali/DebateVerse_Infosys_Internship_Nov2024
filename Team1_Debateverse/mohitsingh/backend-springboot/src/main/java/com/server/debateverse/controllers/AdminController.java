package com.server.debateverse.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.debateverse.entities.User;
import com.server.debateverse.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class AdminController {

    private final UserService userService;

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/block/{userId}")
    public void blockUser(@PathVariable Long userId) {
        userService.blockUser(userId);
    }

    @PutMapping("/unblock/{userId}")
    public void unblockUser(@PathVariable Long userId) {
        userService.unblockUser(userId);
    }
}
