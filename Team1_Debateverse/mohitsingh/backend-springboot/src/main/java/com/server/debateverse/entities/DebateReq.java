package com.server.debateverse.entities;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DebateReq {
    private Debate debate;
    private List<Option> options;
}
