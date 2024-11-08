package com.server.debateverse.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.debateverse.entities.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    User findByEmail(String email);
    
}
