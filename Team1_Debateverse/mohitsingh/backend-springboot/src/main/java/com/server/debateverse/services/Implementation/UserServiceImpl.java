package com.server.debateverse.services.Implementation;

import java.util.List;

import org.springframework.stereotype.Service;

import com.server.debateverse.entities.User;
import com.server.debateverse.repositories.UserRepo;
import com.server.debateverse.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;

    @Override
    public List<User> getAllUsers() {
        return userRepo.findByRole(User.Role.USER);

    }

    @Override
    public void blockUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(true);
        userRepo.save(user);
    }

    @Override
    public void unblockUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(false);
        userRepo.save(user);
    }
}
