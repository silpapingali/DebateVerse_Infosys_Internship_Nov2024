package com.server.debateverse.services;

import java.util.List;

import com.server.debateverse.entities.Vote;
import com.server.debateverse.entities.VoteReq;

public interface VoteService {

    public String saveVotes(List<VoteReq> votes);

    public List<Vote> getVotes(Long userId, Long debateId);
    
}
