package com.server.debateverse.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.debateverse.entities.Vote;

@Repository
public interface VoteRepo extends JpaRepository<Vote, Long> {
    
}
