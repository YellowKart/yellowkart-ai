package com.yellowkart.ai;

import com.yellowkart.ai.dto.ListSuggestResponse;
import com.yellowkart.ai.dto.SuggestResponse;
import com.yellowkart.ai.dto.TextSuggestRequest;
import com.yellowkart.ai.dto.WebsiteCatalogRequest;
import com.yellowkart.ai.dto.WebsiteCatalogResponse;
import com.yellowkart.ai.service.AiSuggestService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.nio.file.Files;
import java.util.LinkedHashMap;
import java.util.Map;
import com.yellowkart.ai.logging.Traced;

@Path("/api/ai")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "AI Suggestions", description = "Construction product suggestions via OpenAI Vision, Whisper, or text")
@Traced
public class AiResource {

    @Inject
    AiSuggestService aiSuggestService;

    @GET
    @Path("/health")
    @Operation(summary = "AI service health and provider mode")
    public Map<String, Object> health() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("service", "ai-service");
        status.put("provider", aiSuggestService.providerStatus());
        status.put("openaiConfigured", aiSuggestService.isOpenAiConfigured());
        status.put("mode", "openai-first");
        return status;
    }

    @POST
    @Path("/suggest/text")
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(summary = "Suggest products from a text query")
    public SuggestResponse suggestText(TextSuggestRequest request) {
        if (request == null || request.query == null || request.query.isBlank()) {
            throw new IllegalArgumentException("query is required");
        }
        return aiSuggestService.suggestFromText(request.query, request.limit);
    }

    @POST
    @Path("/suggest/image")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Suggest products from an uploaded or camera-captured image (OpenAI Vision)")
    public SuggestResponse suggestImage(
            @RestForm("file") FileUpload file,
            @RestForm("hint") String hint,
            @RestForm("limit") Integer limit
    ) {
        if (file == null || file.uploadedFile() == null) {
            throw new IllegalArgumentException("image file is required");
        }
        try {
            byte[] bytes = Files.readAllBytes(file.uploadedFile());
            return aiSuggestService.suggestFromImage(
                    bytes,
                    file.contentType(),
                    file.fileName(),
                    hint,
                    limit
            );
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to process image: " + e.getMessage(), e);
        }
    }

    @POST
    @Path("/suggest/list-image")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Extract handwritten multilingual shopping list lines and map each to catalog products")
    public ListSuggestResponse suggestListImage(
            @RestForm("file") FileUpload file,
            @RestForm("hint") String hint,
            @RestForm("limit") Integer limit
    ) {
        if (file == null || file.uploadedFile() == null) {
            throw new IllegalArgumentException("image file is required");
        }
        try {
            byte[] bytes = Files.readAllBytes(file.uploadedFile());
            return aiSuggestService.suggestFromHandwrittenList(
                    bytes,
                    file.contentType(),
                    file.fileName(),
                    hint,
                    limit
            );
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to process list image: " + e.getMessage(), e);
        }
    }

    @POST
    @Path("/catalog/website")
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(summary = "Extract catalog products from any brand website URL list (AI, brand-agnostic)")
    public WebsiteCatalogResponse extractWebsiteCatalog(WebsiteCatalogRequest request) {
        return aiSuggestService.extractWebsiteCatalog(request);
    }

    @POST
    @Path("/suggest/voice")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Suggest products from voice audio (Whisper) and/or transcript")
    public SuggestResponse suggestVoice(
            @RestForm("file") FileUpload file,
            @RestForm("transcript") String transcript,
            @RestForm("limit") Integer limit
    ) {
        boolean hasFile = file != null && file.uploadedFile() != null;
        boolean hasTranscript = transcript != null && !transcript.isBlank();
        if (!hasFile && !hasTranscript) {
            throw new IllegalArgumentException("Provide an audio file and/or transcript");
        }
        try {
            byte[] bytes = null;
            String contentType = null;
            String fileName = null;
            if (hasFile) {
                bytes = Files.readAllBytes(file.uploadedFile());
                contentType = file.contentType();
                fileName = file.fileName();
            }
            return aiSuggestService.suggestFromVoice(bytes, contentType, fileName, transcript, limit);
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to process voice input: " + e.getMessage(), e);
        }
    }
}
