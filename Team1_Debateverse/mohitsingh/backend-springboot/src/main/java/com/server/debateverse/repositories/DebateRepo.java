package com.server.debateverse.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.User;

@Repository
public interface DebateRepo extends JpaRepository<Debate, Long> {
        List<Debate> findByCreatedBy(User user);

        List<Debate> findByIsPublic(boolean isPublic);

        @Query("SELECT d FROM Debate d WHERE d.createdBy.id != :userId ORDER BY d.createdOn DESC")
        Page<Debate> findAllExceptUserDebates(@Param("userId") Long userId, Pageable pageable);

        Page<Debate> findAll(Pageable pageable);

        @Query("SELECT d FROM Debate d JOIN d.likes u WHERE u.id = :userId")
        List<Debate> findLikedDebatesByUserId(@Param("userId") Long userId);

}
