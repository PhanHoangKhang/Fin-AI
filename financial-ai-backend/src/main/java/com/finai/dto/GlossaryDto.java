package com.finai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlossaryDto {
    private String id;
    private String term;
    private String fullName;
    private String category;
    private String categoryName;
    private String shortDefinition;
    private String fullDefinition;
    private String example;
    private String firstLetter;
}