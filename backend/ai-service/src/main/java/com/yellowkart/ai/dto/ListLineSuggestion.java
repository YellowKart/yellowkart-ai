package com.yellowkart.ai.dto;

import java.util.ArrayList;
import java.util.List;
import com.yellowkart.ai.logging.YkTrace;

public class ListLineSuggestion {

    public String rawText;

    public Double quantity;

    public String unit;

    public String brandHint;

    public String queryText;

    public String detectedLanguage;

    public List<ProductSuggestion> suggestions = new ArrayList<>();

    public ListLineSuggestion() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ListLineSuggestion", "<init>")) {
        }
    }
}
