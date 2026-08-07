package com.yellowkart.ai.dto;

import java.util.ArrayList;
import java.util.List;

public class HandwrittenListExtraction {
    public String summary;
    public String replyMessage;
    public String detectedLanguage;
    public String detectedLanguageName;
    public boolean usedExternalAi;
    public String providerMode;
    public List<HandwrittenListItem> items = new ArrayList<>();

    public HandwrittenListExtraction() {
    }
}
