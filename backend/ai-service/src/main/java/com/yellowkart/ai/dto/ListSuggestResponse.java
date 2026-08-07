package com.yellowkart.ai.dto;

import java.util.ArrayList;
import java.util.List;

public class ListSuggestResponse {
    public String inputType;
    public String replyMessage;
    public String detectedLanguage;
    public String detectedLanguageName;
    public String analysisSummary;
    public boolean usedExternalAi;
    public List<ListLineSuggestion> lines = new ArrayList<>();

    public ListSuggestResponse() {
    }
}
