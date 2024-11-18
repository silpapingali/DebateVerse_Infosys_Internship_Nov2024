package com.server.debateverse.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DebateDTO {
    private Long id;
    private String text;
    private Long createdById; // Reference only the user ID
    private List<OptionDTO> options; // Embed simplified OptionDTO
}

