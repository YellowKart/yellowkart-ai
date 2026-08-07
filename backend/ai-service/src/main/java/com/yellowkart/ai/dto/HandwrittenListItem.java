package com.yellowkart.ai.dto;

public class HandwrittenListItem {
    public String rawText;
    public Double quantity;
    public String unit;
    public String queryText;
    public String brandHint;
    public String detectedLanguage;

    public HandwrittenListItem() {
    }

    public HandwrittenListItem(String rawText, Double quantity, String unit, String queryText,
                               String brandHint, String detectedLanguage) {
        this.rawText = rawText;
        this.quantity = quantity;
        this.unit = unit;
        this.queryText = queryText;
        this.brandHint = brandHint;
        this.detectedLanguage = detectedLanguage;
    }
}
