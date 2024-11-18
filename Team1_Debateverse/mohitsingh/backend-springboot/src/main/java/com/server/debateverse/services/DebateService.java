package com.server.debateverse.services;

import java.util.List;

import com.server.debateverse.entities.Debate;

public interface DebateService {
    Debate createDebate(Debate debate, Long userId);
    List<Debate> getAllDebates();
    List<Debate> getPublicDebates();
}
