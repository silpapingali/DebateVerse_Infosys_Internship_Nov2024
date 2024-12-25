package com.server.debateverse.services;

import java.util.List;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.DebateReq;
import com.server.debateverse.entities.Option;

public interface DebateService {
    Debate createDebate(Debate debate, Long userId, List<Option> options);
    List<Debate> getAllDebates();
    List<Debate> getPublicDebates();
    Debate getDebateById(Long id);
    List<Debate> getDebatesbyUser(Long userId);
    List<Debate> getDebatesExceptUserDebates(Long userId);
    Object createBatchDebate(List<DebateReq> debateReqs, Long userId);
    void likeDebate(Long debateId, Long userId);
    void dislikeDebate(Long debateId, Long userId);
    List<Debate> getLikedDebatesByUserId(Long userId);
}
