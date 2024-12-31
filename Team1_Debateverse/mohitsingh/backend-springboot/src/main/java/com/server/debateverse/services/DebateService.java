package com.server.debateverse.services;

import java.util.List;

import org.springframework.data.domain.Page;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.DebateReq;
import com.server.debateverse.entities.Option;

public interface DebateService {
    Debate createDebate(Debate debate, Long userId, List<Option> options);

    Page<Debate> getAllDebates(int page, int size);

    List<Debate> getPublicDebates();

    Debate getDebateById(Long id);

    List<Debate> getDebatesbyUser(Long userId);

    Page<Debate> getDebatesExceptUserDebates(Long userId, int page, int size);

    Object createBatchDebate(List<DebateReq> debateReqs, Long userId);

    void likeDebate(Long debateId, Long userId);

    void dislikeDebate(Long debateId, Long userId);

    List<Debate> getLikedDebatesByUserId(Long userId);

    void blockDebate(Long debateId);

    void unblockDebate(Long debateId);

}
