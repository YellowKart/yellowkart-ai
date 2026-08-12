package com.yellowkart.ai.service;

import com.yellowkart.ai.dto.AiInterpretation;
import com.yellowkart.ai.dto.HandwrittenListExtraction;
import com.yellowkart.ai.dto.HandwrittenListItem;
import com.yellowkart.ai.dto.ListLineSuggestion;
import com.yellowkart.ai.dto.ListSuggestResponse;
import com.yellowkart.ai.dto.ProductSuggestion;
import com.yellowkart.ai.dto.SuggestResponse;
import com.yellowkart.ai.dto.WebsiteCatalogRequest;
import com.yellowkart.ai.dto.WebsiteCatalogResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;
import java.util.Locale;
import com.yellowkart.ai.logging.Traced;

@ApplicationScoped
@Traced
public class AiSuggestService {

    @Inject
    OpenAiClient openAiClient;

    @Inject
    ProductMatcher productMatcher;

    @ConfigProperty(name = "ai.suggestions.limit", defaultValue = "8")
    int defaultLimit;

    public SuggestResponse suggestFromText(String query, Integer limit) {
        AiInterpretation interpretation = openAiClient.interpretText(query);
        return toResponse("text", interpretation, limit);
    }

    public SuggestResponse suggestFromImage(byte[] imageBytes, String contentType, String fileName,
                                            String hint, Integer limit) {
        AiInterpretation interpretation = openAiClient.analyzeImage(imageBytes, contentType, fileName, hint);
        return toResponse("image", interpretation, limit);
    }

    public SuggestResponse suggestFromVoice(byte[] audioBytes, String contentType, String fileName,
                                            String transcript, Integer limit) {
        AiInterpretation interpretation = openAiClient.analyzeVoice(audioBytes, contentType, fileName, transcript);
        return toResponse("voice", interpretation, limit);
    }

    public ListSuggestResponse suggestFromHandwrittenList(byte[] imageBytes, String contentType, String fileName,
                                                          String hint, Integer limitPerLine) {
        HandwrittenListExtraction extraction = openAiClient.analyzeHandwrittenList(
                imageBytes, contentType, fileName, hint);
        int perLine = limitPerLine == null || limitPerLine < 1 ? 5 : Math.min(limitPerLine, 10);

        ListSuggestResponse response = new ListSuggestResponse();
        response.inputType = "list-image";
        response.replyMessage = extraction.replyMessage;
        response.detectedLanguage = extraction.detectedLanguage;
        response.detectedLanguageName = extraction.detectedLanguageName;
        response.analysisSummary = extraction.summary;
        response.usedExternalAi = extraction.usedExternalAi;

        for (HandwrittenListItem item : extraction.items) {
            AiInterpretation interpretation = openAiClient.interpretText(
                    buildLineQuery(item));
            List<ProductSuggestion> suggestions = productMatcher.match(interpretation, perLine);
            localizeReasons(suggestions, item.detectedLanguage != null
                    ? item.detectedLanguage
                    : extraction.detectedLanguage);

            ListLineSuggestion line = new ListLineSuggestion();
            line.rawText = item.rawText;
            line.quantity = item.quantity;
            line.unit = item.unit;
            line.brandHint = item.brandHint;
            line.queryText = item.queryText;
            line.detectedLanguage = item.detectedLanguage;
            line.suggestions = suggestions;
            response.lines.add(line);
        }
        return response;
    }

    public WebsiteCatalogResponse extractWebsiteCatalog(WebsiteCatalogRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request is required");
        }
        if (request.brand == null || request.brand.isBlank()) {
            throw new IllegalArgumentException("brand is required");
        }
        if (request.urls == null || request.urls.isEmpty()) {
            throw new IllegalArgumentException("urls are required (crawl the brand sitemap first)");
        }
        return openAiClient.extractWebsiteCatalog(request);
    }

    public String providerStatus() {
        return openAiClient.providerStatus();
    }

    public boolean isOpenAiConfigured() {
        return openAiClient.isConfigured();
    }

    private String buildLineQuery(HandwrittenListItem item) {
        StringBuilder sb = new StringBuilder();
        if (item.queryText != null && !item.queryText.isBlank()) {
            sb.append(item.queryText);
        } else if (item.rawText != null) {
            sb.append(item.rawText);
        }
        if (item.brandHint != null && !item.brandHint.isBlank()) {
            sb.append(' ').append(item.brandHint);
        }
        return sb.toString().trim();
    }

    private SuggestResponse toResponse(String inputType, AiInterpretation interpretation, Integer limit) {
        int effectiveLimit = limit == null || limit < 1 ? defaultLimit : Math.min(limit, 20);
        List<ProductSuggestion> suggestions = productMatcher.match(interpretation, effectiveLimit);
        localizeReasons(suggestions, interpretation.detectedLanguage);

        SuggestResponse response = new SuggestResponse();
        response.inputType = inputType;
        response.interpretedQuery = interpretation.queryText;
        response.transcriptOriginal = interpretation.transcriptOriginal;
        response.detectedLanguage = interpretation.detectedLanguage;
        response.detectedLanguageName = interpretation.detectedLanguageName;
        response.replyMessage = interpretation.replyMessage != null && !interpretation.replyMessage.isBlank()
                ? interpretation.replyMessage
                : interpretation.summary;
        response.detectedIntents = interpretation.intents;
        response.detectedMaterials = interpretation.materials;
        response.analysisSummary = interpretation.summary;
        response.usedExternalAi = interpretation.usedExternalAi;
        response.suggestions = suggestions;
        return response;
    }

    private void localizeReasons(List<ProductSuggestion> suggestions, String lang) {
        if (suggestions == null || lang == null) return;
        String code = lang.toLowerCase(Locale.ROOT);
        if (code.startsWith("en")) return;
        for (ProductSuggestion suggestion : suggestions) {
            String matched = suggestion.matchedKeywords == null || suggestion.matchedKeywords.isEmpty()
                    ? suggestion.category
                    : String.join(", ", suggestion.matchedKeywords.stream().limit(4).toList());
            suggestion.reason = switch (code.length() >= 2 ? code.substring(0, 2) : code) {
                case "hi" -> "मेल: " + matched;
                case "bn" -> "মিল: " + matched;
                case "ta" -> "பொருத்தம்: " + matched;
                case "te" -> "సరిపోలిక: " + matched;
                case "mr" -> "जुळणी: " + matched;
                case "gu" -> "મેળ: " + matched;
                case "kn" -> "ಹೊಂದಾಣಿಕೆ: " + matched;
                case "ml" -> "പൊരുത്തം: " + matched;
                case "pa" -> "ਮੇਲ: " + matched;
                case "ur" -> "مماثلت: " + matched;
                default -> suggestion.reason;
            };
        }
    }
}
