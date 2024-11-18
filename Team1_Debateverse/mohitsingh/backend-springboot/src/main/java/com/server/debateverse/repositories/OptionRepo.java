package com.server.debateverse.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.Option;

@Repository
public interface OptionRepo extends JpaRepository<Option, Long> {
    List<Option> findByDebate(Debate debate);
}
