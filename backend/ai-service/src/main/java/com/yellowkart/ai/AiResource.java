package com.yellowkart.ai;

import com.yellowkart.ai.logging.Logged;
import com.yellowkart.ai.dto.ListSuggestResponse;
import com.yellowkart.ai.dto.SuggestResponse;
import com.yellowkart.ai.dto.TextSuggestRequest;
import com.yellowkart.ai.dto.WebsiteCatalogRequest;
import com.yellowkart.ai.dto.WebsiteCatalogResponse;
import com.yellowkart.ai.logging.FlowTimer;
import com.yellowkart.ai.service.AiSuggestService;
import org.jboss.logging.Logger;
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
import com.yellowkart.ai.logging.YkTrace;

@Path("/api/ai")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "AI Suggestions", description = "Construction product suggestions via OpenAI Vision, Whisper, or text")
@Logged
public class AiResource {

    private static final Logger LOG = Logger.getLogger(AiResource.class);

    @Inject
    AiSuggestService aiSuggestService;

    @GET
    @Path("/health")
    @Operation(summary = "AI service health and provider mode")
    public Map<String, Object> health() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("AiResource", "health")) {
            Map<String, Object> status = new LinkedHashMap<>();
            status.put("status", "UP");
            status.put("service", "ai-service");
            status.put("provider", aiSuggestService.providerStatus());
            status.put("openaiConfigured", aiSuggestService.isOpenAiConfigured());
            status.put("mode", "openai-first");
            return status;
        }
    }

    @POST
    @Path("/suggest/text")
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(summary = "Suggest products from a text query")
    public SuggestResponse suggestText(TextSuggestRequest request) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("AiResource", "suggestText")) {
            if (request == null || request.query == null || request.query.isBlank()) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("AiResource", "suggestText", "b1")) {
                    throw new IllegalArgumentException("query is required");
                }
            }
            FlowTimer flow = FlowTimer.start(LOG, "ai.suggest-text", java.util.Map.of("queryLength", request.query.length(), "limit", request.limit == null ? -1 : request.limit));
            try {
                try (YkTrace.Scope __ykBlock2 = YkTrace.block("AiResource", "suggestText", "b2")) {
                    SuggestResponse response = flow.time("suggestFromText", () -> aiSuggestService.suggestFromText(request.query, request.limit));
                    flow.success(java.util.Map.of("suggestionCount", response == null || response.suggestions == null ? 0 : response.suggestions.size()));
                    return response;
                }
            } catch (RuntimeException ex) {
                try (YkTrace.Scope __ykBlock3 = YkTrace.block("AiResource", "suggestText", "b3")) {
                    flow.failure(ex);
                    throw ex;
                }
            }
        }
    }

    @POST
    @Path("/suggest/image")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Suggest products from an uploaded or camera-captured image (OpenAI Vision)")
    public SuggestResponse suggestImage(@RestForm("file") FileUpload file, @RestForm("hint") String hint, @RestForm("limit") Integer limit) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("AiResource", "suggestImage")) {
            if (file == null || file.uploadedFile() == null) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("AiResource", "suggestImage", "b1")) {
                    throw new IllegalArgumentException("image file is required");
                }
            }
            FlowTimer flow = FlowTimer.start(LOG, "ai.suggest-image", java.util.Map.of("contentType", String.valueOf(file.contentType()), "limit", limit == null ? -1 : limit));
            try {
                try (YkTrace.Scope __ykBlock4 = YkTrace.block("AiResource", "suggestImage", "b4")) {
                    byte[] bytes = flow.time("read-upload", () -> {
                        try {
                            try (YkTrace.Scope __ykBlock2 = YkTrace.block("AiResource", "suggestImage", "b2")) {
                                return Files.readAllBytes(file.uploadedFile());
                            }
                        } catch (Exception e) {
                            try (YkTrace.Scope __ykBlock3 = YkTrace.block("AiResource", "suggestImage", "b3")) {
                                throw new IllegalStateException("Failed to read image upload", e);
                            }
                        }
                    });
                    SuggestResponse response = flow.time("suggestFromImage", () -> aiSuggestService.suggestFromImage(bytes, file.contentType(), file.fileName(), hint, limit));
                    flow.success(java.util.Map.of("bytes", bytes.length, "suggestionCount", response == null || response.suggestions == null ? 0 : response.suggestions.size()));
                    return response;
                }
            } catch (RuntimeException e) {
                try (YkTrace.Scope __ykBlock5 = YkTrace.block("AiResource", "suggestImage", "b5")) {
                    flow.failure(e);
                    throw e;
                }
            }
        }
    }

    @POST
    @Path("/suggest/list-image")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Extract handwritten multilingual shopping list lines and map each to catalog products")
    public ListSuggestResponse suggestListImage(@RestForm("file") FileUpload file, @RestForm("hint") String hint, @RestForm("limit") Integer limit) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("AiResource", "suggestListImage")) {
            if (file == null || file.uploadedFile() == null) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("AiResource", "suggestListImage", "b1")) {
                    throw new IllegalArgumentException("image file is required");
                }
            }
            FlowTimer flow = FlowTimer.start(LOG, "ai.suggest-list-image", java.util.Map.of("contentType", String.valueOf(file.contentType()), "limit", limit == null ? -1 : limit));
            try {
                try (YkTrace.Scope __ykBlock4 = YkTrace.block("AiResource", "suggestListImage", "b4")) {
                    byte[] bytes = flow.time("read-upload", () -> {
                        try {
                            try (YkTrace.Scope __ykBlock2 = YkTrace.block("AiResource", "suggestListImage", "b2")) {
                                return Files.readAllBytes(file.uploadedFile());
                            }
                        } catch (Exception e) {
                            try (YkTrace.Scope __ykBlock3 = YkTrace.block("AiResource", "suggestListImage", "b3")) {
                                throw new IllegalStateException("Failed to read list-image upload", e);
                            }
                        }
                    });
                    ListSuggestResponse response = flow.time("suggestFromHandwrittenList", () -> aiSuggestService.suggestFromHandwrittenList(bytes, file.contentType(), file.fileName(), hint, limit));
                    flow.success(java.util.Map.of("bytes", bytes.length, "lineCount", response == null || response.lines == null ? 0 : response.lines.size()));
                    return response;
                }
            } catch (RuntimeException e) {
                try (YkTrace.Scope __ykBlock5 = YkTrace.block("AiResource", "suggestListImage", "b5")) {
                    flow.failure(e);
                    throw e;
                }
            }
        }
    }

    @POST
    @Path("/catalog/website")
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(summary = "Extract catalog products from any brand website URL list (AI, brand-agnostic)")
    public WebsiteCatalogResponse extractWebsiteCatalog(WebsiteCatalogRequest request) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("AiResource", "extractWebsiteCatalog")) {
            return aiSuggestService.extractWebsiteCatalog(request);
        }
    }

    @POST
    @Path("/suggest/voice")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Suggest products from voice audio (Whisper) and/or transcript")
    public SuggestResponse suggestVoice(@RestForm("file") FileUpload file, @RestForm("transcript") String transcript, @RestForm("limit") Integer limit) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("AiResource", "suggestVoice")) {
            boolean hasFile = file != null && file.uploadedFile() != null;
            boolean hasTranscript = transcript != null && !transcript.isBlank();
            if (!hasFile && !hasTranscript) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("AiResource", "suggestVoice", "b1")) {
                    throw new IllegalArgumentException("Provide an audio file and/or transcript");
                }
            }
            try {
                try (YkTrace.Scope __ykBlock3 = YkTrace.block("AiResource", "suggestVoice", "b3")) {
                    byte[] bytes = null;
                    String contentType = null;
                    String fileName = null;
                    if (hasFile) {
                        try (YkTrace.Scope __ykBlock2 = YkTrace.block("AiResource", "suggestVoice", "b2")) {
                            bytes = Files.readAllBytes(file.uploadedFile());
                            contentType = file.contentType();
                            fileName = file.fileName();
                        }
                    }
                    return aiSuggestService.suggestFromVoice(bytes, contentType, fileName, transcript, limit);
                }
            } catch (IllegalArgumentException | IllegalStateException e) {
                try (YkTrace.Scope __ykBlock4 = YkTrace.block("AiResource", "suggestVoice", "b4")) {
                    throw e;
                }
            } catch (Exception e) {
                try (YkTrace.Scope __ykBlock5 = YkTrace.block("AiResource", "suggestVoice", "b5")) {
                    throw new IllegalStateException("Failed to process voice input: " + e.getMessage(), e);
                }
            }
        }
    }
}
