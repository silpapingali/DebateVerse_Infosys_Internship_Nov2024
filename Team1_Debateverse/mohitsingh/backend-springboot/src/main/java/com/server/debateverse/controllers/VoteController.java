package com.server.debateverse.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.debateverse.entities.VoteReq;
import com.server.debateverse.services.VoteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/votes")
public class VoteController {

    private final VoteService voteService;
    
    @PutMapping("/save")
    public ResponseEntity<?> saveVote(@RequestBody List<VoteReq> votes) {
        return ResponseEntity.ok(voteService.saveVotes(votes));
    }
}
