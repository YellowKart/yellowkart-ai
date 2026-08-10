package com.yellowkart.ai.dto;

import java.util.ArrayList;
import java.util.List;
import com.yellowkart.ai.logging.YkTrace;

public class ListSuggestResponse {

    public String inputType;

    public String replyMessage;

    public String detectedLanguage;

    public String detectedLanguageName;

    public String analysisSummary;

    public boolean usedExternalAi;

    public List<ListLineSuggestion> lines = new ArrayList<>();

    public ListSuggestResponse() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ListSuggestResponse", "<init>")) {
        }
    }
}
