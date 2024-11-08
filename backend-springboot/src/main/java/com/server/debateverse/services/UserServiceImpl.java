package com.server.debateverse.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.server.debateverse.entities.User;
import com.server.debateverse.repositories.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;

    @Override
    public User createUser(User user) {
        User existingUser = userRepo.findByEmail(user.getEmail());
        if (existingUser != null) {
            throw new RuntimeException("User already exists");
        }

        User newUser = new User();
        newUser.setPassword(user.getPassword());
        newUser.setEmail(user.getEmail());
        newUser.setRole(User.Role.USER);
        return userRepo.save(newUser);
    }

    @Override
    public String deleteUser(Long id) {
        userRepo.deleteById(id);
        return "User with id " + id + " has been deleted";
    }

    @Override
    public User updateUser(User user, Long id) {
        User existingUser = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setPassword(user.getPassword());
        existingUser.setEmail(user.getEmail());
        return userRepo.save(existingUser);
    }

    @Override
    public User getUser(Long id) {
        return userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

}
