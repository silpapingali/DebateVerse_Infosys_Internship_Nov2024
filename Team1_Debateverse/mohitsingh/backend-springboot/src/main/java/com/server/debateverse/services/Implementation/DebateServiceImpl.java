package com.server.debateverse.services.Implementation;

import java.util.List;

import org.springframework.stereotype.Service;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.User;
import com.server.debateverse.repositories.DebateRepo;
import com.server.debateverse.repositories.UserRepo;
import com.server.debateverse.services.DebateService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DebateServiceImpl implements DebateService {

    private final DebateRepo debateRepo;

    private final UserRepo userRepo;

    @Override
    public Debate createDebate(Debate debate, Long userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        debate.setCreatedBy(user);
        return debateRepo.save(debate);
    }

    @Override
    public List<Debate> getAllDebates() {
        return debateRepo.findAll();
    }

    @Override
    public List<Debate> getPublicDebates() {
        return debateRepo.findByIsPublic(true);
    }
    
}
