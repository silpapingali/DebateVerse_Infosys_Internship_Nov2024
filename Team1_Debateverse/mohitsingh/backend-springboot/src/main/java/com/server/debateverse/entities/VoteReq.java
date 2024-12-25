package com.server.debateverse.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteReq {
    private Long userId;
    private Long optionId;
    private Long debateId;
    private int totalVotes;
}
