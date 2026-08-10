package com.yellowkart.ai.dto;

import com.yellowkart.ai.logging.YkTrace;

public class TextSuggestRequest {

    public String query;

    public Integer limit;

    public TextSuggestRequest() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("TextSuggestRequest", "<init>")) {
        }
    }
}
