package com.server.debateverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OptionDTO {
    private Long id;
    private String text;
    private Long debateId; // Reference only the debate ID
}
