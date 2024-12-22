package com.server.debateverse.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.DebateReq;
import com.server.debateverse.entities.Option;
import com.server.debateverse.entities.User;
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

    // @GetMapping
    // public ResponseEntity<List<Debate>> getAllDebates() {
    //     return ResponseEntity.ok(debateService.getAllDebates());
    // }

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
    public ResponseEntity<List<Debate>> getDebatesExceptUserDebates() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println("User" + user);
        return ResponseEntity.ok(debateService.getDebatesExceptUserDebates(user.getId()));
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
}
