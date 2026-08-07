package com.yellowkart.ai;

import com.yellowkart.ai.dto.AiInterpretation;
import com.yellowkart.ai.dto.ProductSuggestion;
import com.yellowkart.ai.service.AiSuggestService;
import com.yellowkart.ai.service.IndianLanguageLexicon;
import com.yellowkart.ai.service.ProductMatcher;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
public class AiSuggestTest {

    @Inject
    AiSuggestService aiSuggestService;

    @Inject
    ProductMatcher productMatcher;

    @Test
    void healthReportsOpenaiFirstMode() {
        given()
                .when().get("/api/ai/health")
                .then()
                .statusCode(200)
                .body("status", equalTo("UP"))
                .body("mode", equalTo("openai-first"));
    }

    @Test
    void textSuggestReturnsConstructionProducts() {
        given()
                .contentType("application/json")
                .body("{\"query\":\"I need cement and waterproofing for terrace\",\"limit\":5}")
                .when().post("/api/ai/suggest/text")
                .then()
                .statusCode(200)
                .body("inputType", equalTo("text"))
                .body("suggestions.size()", greaterThan(0))
                .body("replyMessage", notNullValue())
                .body("detectedLanguage", notNullValue());
    }

    @Test
    void hindiTextSuggestLocalizesReply() {
        given()
                .contentType("application/json")
                .body("{\"query\":\"मुझे सीमेंट और वॉटरप्रूफिंग चाहिए\",\"limit\":5}")
                .when().post("/api/ai/suggest/text")
                .then()
                .statusCode(200)
                .body("suggestions.size()", greaterThan(0))
                .body("detectedLanguage", equalTo("hi"));
    }

    @Test
    void hinglishVoiceTranscriptSuggestWorks() {
        given()
                .multiPart("transcript", "Bhai TMT sariya aur cement chahiye columns ke liye")
                .multiPart("limit", "5")
                .when().post("/api/ai/suggest/voice")
                .then()
                .statusCode(200)
                .body("inputType", equalTo("voice"))
                .body("suggestions.size()", greaterThan(0))
                .body("replyMessage", notNullValue());
    }

    @Test
    void lexiconExpandsHindiCement() {
        List<String> expanded = IndianLanguageLexicon.expand("मुझे सीमेंट चाहिए");
        assertTrue(expanded.contains("cement"));
    }

    @Test
    void matcherScoresCementQuery() {
        AiInterpretation interpretation = new AiInterpretation();
        interpretation.queryText = "opc cement for foundation slab";
        interpretation.transcriptOriginal = "opc cement for foundation slab";
        interpretation.keywords = List.of("cement", "opc", "foundation", "slab");
        interpretation.materials = List.of("cement", "concrete");
        interpretation.intents = List.of("structural");

        List<ProductSuggestion> suggestions = productMatcher.match(interpretation, 5);
        assertFalse(suggestions.isEmpty());
        assertTrue(suggestions.get(0).name.toLowerCase().contains("cement")
                || suggestions.get(0).category.toLowerCase().contains("cement"));
    }

    @Test
    void serviceSuggestFromText() {
        var response = aiSuggestService.suggestFromText("PVC pipes and bathroom faucet", 5);
        assertFalse(response.suggestions.isEmpty());
        assertTrue(response.detectedMaterials.contains("pipes")
                || response.interpretedQuery.toLowerCase().contains("pipe")
                || response.suggestions.stream().anyMatch(s -> s.name.toLowerCase().contains("pipe")
                || s.category.toLowerCase().contains("pipe")
                || s.category.toLowerCase().contains("plumb")));
    }

    @Test
    void handwrittenListImageStubMapsLines() {
        byte[] tinyJpeg = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xD9};
        var response = aiSuggestService.suggestFromHandwrittenList(
                tinyJpeg,
                "image/jpeg",
                "10-bags-cement_5-pvc-pipe.jpg",
                "सीमेंट और पाइप",
                3
        );
        assertFalse(response.lines.isEmpty());
        assertTrue(response.lines.stream().anyMatch(line ->
                line.suggestions != null && !line.suggestions.isEmpty()));
    }
}
