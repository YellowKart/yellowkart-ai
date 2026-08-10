package com.yellowkart.ai.dto;

import java.util.ArrayList;
import java.util.List;
import com.yellowkart.ai.logging.YkTrace;

/**
 * Structured output from Vision / Whisper interpretation before product matching.
 */
public class AiInterpretation {

    public String summary;

    public String queryText;

    public String replyMessage;

    public String detectedLanguage;

    public String detectedLanguageName;

    public String transcriptOriginal;

    public List<String> materials = new ArrayList<>();

    public List<String> intents = new ArrayList<>();

    public List<String> keywords = new ArrayList<>();

    public boolean usedExternalAi;

    public String providerMode;

    public AiInterpretation() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("AiInterpretation", "<init>")) {
        }
    }
}
