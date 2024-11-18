package com.server.debateverse.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.services.DebateService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/debates")
@RequiredArgsConstructor
public class DebateController {

    private final DebateService debateService;

    @PostMapping("/{userId}")
    public ResponseEntity<Debate> createDebate(
            @PathVariable Long userId,
            @RequestBody Debate debate) {
        return ResponseEntity.ok(debateService.createDebate(debate, userId));
    }

    @GetMapping
    public ResponseEntity<List<Debate>> getAllDebates() {
        return ResponseEntity.ok(debateService.getAllDebates());
    }

    @GetMapping("/public")
    public ResponseEntity<List<Debate>> getPublicDebates() {
        return ResponseEntity.ok(debateService.getPublicDebates());
    }
}
