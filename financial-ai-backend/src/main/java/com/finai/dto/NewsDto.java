package com.finai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder; 

import java.util.List;

@Data
@SuperBuilder 
@AllArgsConstructor
@NoArgsConstructor
public class NewsDto {
    private String id;
    private String ticker;
    private String title;
    private String link;
    private String source;
    private String publishedDate;
    private String sentimentType;

    private int sentimentScore;

    private String aiSummary;
    private List<String> keywords;
}