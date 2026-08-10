package com.yellowkart.ai.dto;

import java.util.ArrayList;
import java.util.List;
import com.yellowkart.ai.logging.YkTrace;

public class SuggestResponse {

    public String inputType;

    public String interpretedQuery;

    public String transcriptOriginal;

    public String detectedLanguage;

    public String detectedLanguageName;

    public String replyMessage;

    public List<String> detectedIntents = new ArrayList<>();

    public List<String> detectedMaterials = new ArrayList<>();

    public String analysisSummary;

    public boolean usedExternalAi;

    public List<ProductSuggestion> suggestions = new ArrayList<>();

    public SuggestResponse() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("SuggestResponse", "<init>")) {
        }
    }
}
