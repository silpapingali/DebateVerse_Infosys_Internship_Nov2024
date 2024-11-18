package com.server.debateverse.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.debateverse.entities.Option;
import com.server.debateverse.services.OptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/options")
@RequiredArgsConstructor
public class OptionController {

    private final OptionService optionService;

    // Add an option to a specific debate
    @PostMapping("/{debateId}")
    public ResponseEntity<Option> addOptionToDebate(
            @PathVariable Long debateId,
            @RequestBody Option option) {
        System.out.println(debateId);
        System.out.println(option);
        Option createdOption = optionService.addOptionToDebate(option, debateId);
        return ResponseEntity.ok(createdOption);
    }

    // Get all options for a specific debate
    @GetMapping("/debate/{debateId}")
    public ResponseEntity<List<Option>> getOptionsByDebate(
            @PathVariable Long debateId) {
        List<Option> options = optionService.getOptionsForDebate(debateId);
        return ResponseEntity.ok(options);
    }
}