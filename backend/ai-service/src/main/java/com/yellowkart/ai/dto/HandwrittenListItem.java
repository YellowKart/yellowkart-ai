package com.yellowkart.ai.dto;

import com.yellowkart.ai.logging.YkTrace;

public class HandwrittenListItem {

    public String rawText;

    public Double quantity;

    public String unit;

    public String queryText;

    public String brandHint;

    public String detectedLanguage;

    public HandwrittenListItem() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("HandwrittenListItem", "<init>")) {
        }
    }

    public HandwrittenListItem(String rawText, Double quantity, String unit, String queryText, String brandHint, String detectedLanguage) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("HandwrittenListItem", "<init>")) {
            this.rawText = rawText;
            this.quantity = quantity;
            this.unit = unit;
            this.queryText = queryText;
            this.brandHint = brandHint;
            this.detectedLanguage = detectedLanguage;
        }
    }
}
