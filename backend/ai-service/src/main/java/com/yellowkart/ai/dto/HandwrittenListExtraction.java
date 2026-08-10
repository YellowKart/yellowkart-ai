package com.yellowkart.ai.dto;

import java.util.ArrayList;
import java.util.List;
import com.yellowkart.ai.logging.YkTrace;

public class HandwrittenListExtraction {

    public String summary;

    public String replyMessage;

    public String detectedLanguage;

    public String detectedLanguageName;

    public boolean usedExternalAi;

    public String providerMode;

    public List<HandwrittenListItem> items = new ArrayList<>();

    public HandwrittenListExtraction() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("HandwrittenListExtraction", "<init>")) {
        }
    }
}
