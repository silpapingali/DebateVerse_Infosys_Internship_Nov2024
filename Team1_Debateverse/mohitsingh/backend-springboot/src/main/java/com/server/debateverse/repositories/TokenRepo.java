package com.server.debateverse.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.debateverse.entities.Token;

@Repository
public interface TokenRepo extends JpaRepository<Token, Long> {

    Token findByToken(String token);
    
}
