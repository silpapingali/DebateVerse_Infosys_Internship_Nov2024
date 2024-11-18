package com.server.debateverse.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.User;

@Repository
public interface DebateRepo extends JpaRepository<Debate, Long> {
    List<Debate> findByCreatedBy(User user);
    List<Debate> findByIsPublic(boolean isPublic);
}
