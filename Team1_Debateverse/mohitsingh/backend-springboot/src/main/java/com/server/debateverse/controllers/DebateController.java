package com.server.debateverse.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.DebateReq;
import com.server.debateverse.entities.Option;
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
            @RequestBody DebateReq debateReq) {
        System.out.println("DebateReq" + debateReq);
        Debate debate = new Debate();
        debate.setText(debateReq.getDebate().getText());

        List<Option> options = debateReq.getOptions();

        return ResponseEntity.ok(debateService.createDebate(debate, userId, options));
    }

    @PostMapping("/batch/{userId}")
    public ResponseEntity<?> createBatchDebate(
            @PathVariable Long userId,
            @RequestBody List<DebateReq> debateReqs) {
        return ResponseEntity.ok(debateService.createBatchDebate(debateReqs, userId));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<Debate>> getAllDebates(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(debateService.getAllDebates(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Debate> getDebateById(@PathVariable Long id) {
        return ResponseEntity.ok(debateService.getDebateById(id));
    }

    @GetMapping("/public")
    public ResponseEntity<List<Debate>> getPublicDebates() {
        return ResponseEntity.ok(debateService.getPublicDebates());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Debate>> getDebatesbyUser(@PathVariable Long userId) {
        return ResponseEntity.ok(debateService.getDebatesbyUser(userId));
    }

    @GetMapping
    public Page<Debate> getDebates(@RequestParam Long userId, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return debateService.getDebatesExceptUserDebates(userId, page, size);
    }

    @PostMapping("/{debateId}/like")
    public ResponseEntity<Void> likeDebate(@PathVariable Long debateId, @RequestParam Long userId) {
        debateService.likeDebate(debateId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{debateId}/dislike")
    public ResponseEntity<Void> dislikeDebate(@PathVariable Long debateId, @RequestParam Long userId) {
        debateService.dislikeDebate(debateId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/liked")
    public ResponseEntity<List<Debate>> getLikedDebatesByUserId(@RequestParam Long userId) {
        return ResponseEntity.ok(debateService.getLikedDebatesByUserId(userId));
    }

    @PutMapping("/{debateId}/block")
    public ResponseEntity<Void> blockDebate(@PathVariable Long debateId) {
        debateService.blockDebate(debateId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{debateId}/unblock")
    public ResponseEntity<Void> unblockDebate(@PathVariable Long debateId) {
        debateService.unblockDebate(debateId);
        return ResponseEntity.ok().build();
    }
}
