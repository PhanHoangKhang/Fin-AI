package com.finai.dto;

import lombok.Data;

@Data
public class StockInfoDto {
    private String ticker;
    private String companyName;
    private String industry;
    private String sector;
    private Double currentPrice;
    private Long marketCap;
    private Double peRatio;
    private Double pbRatio;
    private Double fiftyTwoWeekHigh;
    private Double fiftyTwoWeekLow;
    private String summary;
}