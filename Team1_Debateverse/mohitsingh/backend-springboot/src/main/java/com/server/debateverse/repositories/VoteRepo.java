package com.server.debateverse.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.Option;
import com.server.debateverse.entities.User;
import com.server.debateverse.entities.Vote;

@Repository
public interface VoteRepo extends JpaRepository<Vote, Long> {

    Optional<Vote> findByUserAndDebateAndOption(User user, Debate debate, Option option);

    List<Vote> findByUserIdAndDebateId(Long userId, Long debateId);
    
}
