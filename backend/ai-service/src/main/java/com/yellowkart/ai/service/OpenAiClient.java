package com.yellowkart.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yellowkart.ai.dto.AiInterpretation;
import com.yellowkart.ai.dto.HandwrittenListExtraction;
import com.yellowkart.ai.dto.HandwrittenListItem;
import com.yellowkart.ai.dto.WebsiteCatalogProduct;
import com.yellowkart.ai.dto.WebsiteCatalogRequest;
import com.yellowkart.ai.dto.WebsiteCatalogResponse;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * OpenAI-first Vision + Whisper client with Indian language auto-detection
 * and localized replies (including slang / code-mixing like Hinglish).
 */
@ApplicationScoped
public class OpenAiClient {

    private static final Logger LOG = Logger.getLogger(OpenAiClient.class);

    private static final Map<String, String> LANGUAGE_NAMES = Map.ofEntries(
            Map.entry("en", "English"),
            Map.entry("hi", "Hindi"),
            Map.entry("bn", "Bengali"),
            Map.entry("te", "Telugu"),
            Map.entry("ta", "Tamil"),
            Map.entry("mr", "Marathi"),
            Map.entry("gu", "Gujarati"),
            Map.entry("kn", "Kannada"),
            Map.entry("ml", "Malayalam"),
            Map.entry("pa", "Punjabi"),
            Map.entry("or", "Odia"),
            Map.entry("as", "Assamese"),
            Map.entry("ur", "Urdu"),
            Map.entry("sa", "Sanskrit"),
            Map.entry("ne", "Nepali"),
            Map.entry("sd", "Sindhi"),
            Map.entry("ks", "Kashmiri"),
            Map.entry("mai", "Maithili"),
            Map.entry("sat", "Santali"),
            Map.entry("doi", "Dogri"),
            Map.entry("mni", "Manipuri"),
            Map.entry("kok", "Konkani"),
            Map.entry("bho", "Bhojpuri")
    );

    private static final String VISION_SYSTEM_PROMPT = """
            You are a construction materials expert for YellowKart, an Indian construction e-commerce store.
            Analyze the image and return ONLY valid JSON with this shape:
            {
              "summary": "one sentence in the buyer's language (default Hindi-English mix if unclear)",
              "queryText": "short search-like phrase (English keywords OK for catalog matching)",
              "replyMessage": "friendly buyer-facing reply in the same language as any hint, else simple Hinglish/English",
              "detectedLanguage": "bcp47-ish code like hi, en, ta, te, bn",
              "detectedLanguageName": "Hindi",
              "materials": ["cement","steel"],
              "intents": ["waterproofing"],
              "keywords": ["cement","terrace"]
            }
            Focus on construction products used in India.
            """;

    private static final String INTERPRET_SYSTEM_PROMPT = """
            You are YellowKart's multilingual construction shopping assistant for Indian buyers.
            Understand ALL Indian languages and everyday slang / code-mixing, including but not limited to:
            Hindi, Hinglish, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi,
            Odia, Assamese, Urdu, Bhojpuri, and mixed English+regional speech (e.g. "mujhe cement chahiye",
            "TMT rod vena", "bathroom leak aaguthu", "rang lagao wall pe").
            Auto-detect the buyer's language from the transcript. Reply in THAT same language (or the same
            code-mixed style). Keep materials/intents/keywords in English for catalog matching.
            Return ONLY valid JSON:
            {
              "summary": "localized one-line understanding",
              "queryText": "English search phrase for products",
              "replyMessage": "localized friendly response telling what we found / will suggest",
              "detectedLanguage": "hi|en|ta|te|bn|mr|gu|kn|ml|pa|or|as|ur|...",
              "detectedLanguageName": "Human readable language name",
              "materials": ["cement"],
              "intents": ["waterproofing"],
              "keywords": ["cement","waterproof"]
            }
            """;

    private static final String LIST_VISION_SYSTEM_PROMPT = """
            You are YellowKart's multilingual construction shopping assistant for India.
            The image is a HANDWRITTEN or printed shopping / requirements LIST of construction materials.
            Read EVERY line carefully (including Devanagari, Bengali, Tamil, Telugu, Kannada, Malayalam,
            Gujarati, Gurmukhi, Odia, Urdu, and Latin / Hinglish slang).
            Return ONLY valid JSON:
            {
              "summary": "one sentence in the buyer's language describing the list",
              "replyMessage": "friendly localized reply confirming how many items you read",
              "detectedLanguage": "hi|en|ta|te|bn|mr|gu|kn|ml|pa|or|as|ur|...",
              "detectedLanguageName": "Hindi",
              "items": [
                {
                  "rawText": "exact line text as written",
                  "quantity": 10,
                  "unit": "bags",
                  "queryText": "English catalog search phrase e.g. OPC cement",
                  "brandHint": "UltraTech or empty string",
                  "detectedLanguage": "hi"
                }
              ]
            }
            Rules:
            - One JSON object per distinct list line / product need.
            - quantity must be a number when present; otherwise null.
            - queryText must be English keywords useful for matching construction products.
            - Ignore doodles, totals, phone numbers, and addresses that are not products.
            """;

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(20))
            .build();

    @ConfigProperty(name = "ai.openai.api-key", defaultValue = "unset")
    String apiKey;

    @ConfigProperty(name = "ai.openai.base-url", defaultValue = "https://api.openai.com/v1")
    String baseUrl;

    @ConfigProperty(name = "ai.openai.vision-model", defaultValue = "gpt-4o-mini")
    String visionModel;

    @ConfigProperty(name = "ai.openai.chat-model", defaultValue = "gpt-4o-mini")
    String chatModel;

    @ConfigProperty(name = "ai.openai.transcribe-model", defaultValue = "whisper-1")
    String transcribeModel;

    @ConfigProperty(name = "ai.stub.enabled", defaultValue = "true")
    boolean stubEnabled;

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !"unset".equalsIgnoreCase(apiKey);
    }

    public String providerStatus() {
        if (isConfigured()) {
            return "openai";
        }
        return stubEnabled ? "stub" : "unconfigured";
    }

    public AiInterpretation analyzeImage(byte[] imageBytes, String contentType, String fileName, String hint) {
        if (isConfigured()) {
            try {
                return callVision(imageBytes, contentType, hint);
            } catch (Exception e) {
                LOG.error("OpenAI Vision call failed, falling back to stub", e);
                if (!stubEnabled) {
                    throw new IllegalStateException("OpenAI Vision failed: " + e.getMessage(), e);
                }
            }
        } else if (!stubEnabled) {
            throw new IllegalStateException("OPENAI_API_KEY is required for Vision analysis");
        }
        return stubFromImage(fileName, hint);
    }

    public HandwrittenListExtraction analyzeHandwrittenList(byte[] imageBytes, String contentType,
                                                            String fileName, String hint) {
        if (isConfigured()) {
            try {
                return callListVision(imageBytes, contentType, hint);
            } catch (Exception e) {
                LOG.error("OpenAI list Vision call failed, falling back to stub", e);
                if (!stubEnabled) {
                    throw new IllegalStateException("OpenAI list Vision failed: " + e.getMessage(), e);
                }
            }
        } else if (!stubEnabled) {
            throw new IllegalStateException("OPENAI_API_KEY is required for handwritten list Vision");
        }
        return stubHandwrittenList(fileName, hint);
    }

    public AiInterpretation analyzeVoice(byte[] audioBytes, String contentType, String fileName, String transcriptHint) {
        String transcript = transcriptHint;
        String whisperLanguage = null;
        boolean usedWhisper = false;

        if (audioBytes != null && audioBytes.length > 0) {
            if (isConfigured()) {
                try {
                    WhisperResult whisper = callWhisper(audioBytes, contentType, fileName);
                    usedWhisper = true;
                    whisperLanguage = whisper.language;
                    // Prefer Whisper transcript for auto language detection when audio is present
                    if (whisper.text != null && !whisper.text.isBlank()) {
                        transcript = whisper.text;
                    }
                } catch (Exception e) {
                    LOG.error("OpenAI Whisper call failed", e);
                    if (!stubEnabled && (transcript == null || transcript.isBlank())) {
                        throw new IllegalStateException("OpenAI Whisper failed: " + e.getMessage(), e);
                    }
                }
            } else if (!stubEnabled && (transcript == null || transcript.isBlank())) {
                throw new IllegalStateException("OPENAI_API_KEY is required for Whisper transcription");
            }
        }

        if (transcript == null || transcript.isBlank()) {
            if (!stubEnabled) {
                throw new IllegalStateException("Voice transcript is empty and Whisper is unavailable");
            }
            transcript = stubTranscriptFromFileName(fileName);
        }

        AiInterpretation interpretation = interpretUtterance(transcript, whisperLanguage, usedWhisper);
        interpretation.transcriptOriginal = transcript;
        if (usedWhisper) {
            interpretation.usedExternalAi = true;
            if (interpretation.providerMode == null || interpretation.providerMode.isBlank()) {
                interpretation.providerMode = "openai-whisper";
            }
        }
        return interpretation;
    }

    public AiInterpretation interpretText(String query) {
        return interpretUtterance(query, null, false);
    }

    private AiInterpretation interpretUtterance(String query, String whisperLanguage, boolean fromWhisper) {
        if (isConfigured()) {
            try {
                AiInterpretation interpretation = callMultilingualInterpret(query, whisperLanguage);
                interpretation.transcriptOriginal = query;
                interpretation.usedExternalAi = true;
                interpretation.providerMode = fromWhisper ? "openai-whisper+chat" : "openai-chat";
                return interpretation;
            } catch (Exception e) {
                LOG.error("Multilingual interpret failed, using local fallback", e);
                if (!stubEnabled) {
                    throw new IllegalStateException("Language interpretation failed: " + e.getMessage(), e);
                }
            }
        } else if (!stubEnabled) {
            throw new IllegalStateException("OPENAI_API_KEY is required for multilingual interpretation");
        }
        return localInterpret(query, whisperLanguage, fromWhisper);
    }

    private AiInterpretation callVision(byte[] imageBytes, String contentType, String hint) throws Exception {
        String mime = (contentType == null || contentType.isBlank()) ? "image/jpeg" : contentType;
        String dataUrl = "data:" + mime + ";base64," + Base64.getEncoder().encodeToString(imageBytes);

        ObjectNode root = mapper.createObjectNode();
        root.put("model", visionModel);
        root.put("temperature", 0.2);
        ArrayNode messages = root.putArray("messages");

        ObjectNode system = messages.addObject();
        system.put("role", "system");
        system.put("content", VISION_SYSTEM_PROMPT);

        ObjectNode user = messages.addObject();
        user.put("role", "user");
        ArrayNode content = user.putArray("content");
        ObjectNode textPart = content.addObject();
        textPart.put("type", "text");
        textPart.put("text", (hint == null || hint.isBlank())
                ? "Identify construction products this Indian buyer needs from YellowKart. Auto-detect language of any text in the image/hint."
                : "Buyer hint (may be any Indian language/slang): " + hint);
        ObjectNode imagePart = content.addObject();
        imagePart.put("type", "image_url");
        ObjectNode imageUrl = imagePart.putObject("image_url");
        imageUrl.put("url", dataUrl);

        JsonNode body = postJson("/chat/completions", root);
        String contentText = body.path("choices").path(0).path("message").path("content").asText("");
        AiInterpretation interpretation = parseInterpretationJson(contentText);
        interpretation.usedExternalAi = true;
        interpretation.providerMode = "openai-vision";
        return interpretation;
    }

    private HandwrittenListExtraction callListVision(byte[] imageBytes, String contentType, String hint)
            throws Exception {
        String mime = (contentType == null || contentType.isBlank()) ? "image/jpeg" : contentType;
        String dataUrl = "data:" + mime + ";base64," + Base64.getEncoder().encodeToString(imageBytes);

        ObjectNode root = mapper.createObjectNode();
        root.put("model", visionModel);
        root.put("temperature", 0.1);
        ArrayNode messages = root.putArray("messages");

        ObjectNode system = messages.addObject();
        system.put("role", "system");
        system.put("content", LIST_VISION_SYSTEM_PROMPT);

        ObjectNode user = messages.addObject();
        user.put("role", "user");
        ArrayNode content = user.putArray("content");
        ObjectNode textPart = content.addObject();
        textPart.put("type", "text");
        textPart.put("text", (hint == null || hint.isBlank())
                ? "Extract every product line from this handwritten construction materials list. Support all Indian languages."
                : "Buyer hint (any Indian language): " + hint + ". Extract every product line from the list image.");
        ObjectNode imagePart = content.addObject();
        imagePart.put("type", "image_url");
        ObjectNode imageUrl = imagePart.putObject("image_url");
        imageUrl.put("url", dataUrl);

        JsonNode body = postJson("/chat/completions", root);
        String contentText = body.path("choices").path(0).path("message").path("content").asText("");
        HandwrittenListExtraction extraction = parseListExtractionJson(contentText);
        extraction.usedExternalAi = true;
        extraction.providerMode = "openai-vision-list";
        return extraction;
    }

    private AiInterpretation callMultilingualInterpret(String utterance, String whisperLanguage) throws Exception {
        ObjectNode root = mapper.createObjectNode();
        root.put("model", chatModel);
        root.put("temperature", 0.3);
        ArrayNode messages = root.putArray("messages");

        ObjectNode system = messages.addObject();
        system.put("role", "system");
        system.put("content", INTERPRET_SYSTEM_PROMPT);

        ObjectNode user = messages.addObject();
        user.put("role", "user");
        StringBuilder prompt = new StringBuilder();
        prompt.append("Buyer utterance:\n").append(utterance).append("\n");
        if (whisperLanguage != null && !whisperLanguage.isBlank()) {
            prompt.append("Whisper detected language code: ").append(whisperLanguage)
                    .append(" (").append(languageName(whisperLanguage)).append("). ")
                    .append("Prefer this language for replyMessage/summary unless the text clearly differs.\n");
        }
        prompt.append("Respond with JSON only.");
        user.put("content", prompt.toString());

        JsonNode body = postJson("/chat/completions", root);
        String contentText = body.path("choices").path(0).path("message").path("content").asText("");
        AiInterpretation interpretation = parseInterpretationJson(contentText);
        if ((interpretation.detectedLanguage == null || interpretation.detectedLanguage.isBlank())
                && whisperLanguage != null) {
            interpretation.detectedLanguage = normalizeLang(whisperLanguage);
            interpretation.detectedLanguageName = languageName(whisperLanguage);
        }
        return interpretation;
    }

    private WhisperResult callWhisper(byte[] audioBytes, String contentType, String fileName) throws Exception {
        String boundary = "----YellowKartBoundary" + System.currentTimeMillis();
        String safeName = (fileName == null || fileName.isBlank()) ? "audio.webm" : fileName;
        String mime = (contentType == null || contentType.isBlank()) ? "audio/webm" : contentType;

        // No language= field → Whisper auto-detects (critical for all Indian languages)
        byte[] body = buildWhisperMultipart(boundary, safeName, mime, audioBytes, transcribeModel);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(trimSlash(baseUrl) + "/audio/transcriptions"))
                .timeout(Duration.ofSeconds(90))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                .build();

        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 300) {
            throw new IllegalStateException("Whisper HTTP " + response.statusCode() + ": " + response.body());
        }
        JsonNode json = mapper.readTree(response.body());
        WhisperResult result = new WhisperResult();
        result.text = json.path("text").asText("").trim();
        result.language = normalizeLang(json.path("language").asText(""));
        return result;
    }

    private JsonNode postJson(String path, ObjectNode root) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(trimSlash(baseUrl) + path))
                .timeout(Duration.ofSeconds(60))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(root)))
                .build();
        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 300) {
            throw new IllegalStateException("OpenAI HTTP " + response.statusCode() + ": " + response.body());
        }
        return mapper.readTree(response.body());
    }

    private byte[] buildWhisperMultipart(String boundary, String fileName, String mime, byte[] audio, String model) {
        StringBuilder sb = new StringBuilder();
        sb.append("--").append(boundary).append("\r\n")
                .append("Content-Disposition: form-data; name=\"model\"\r\n\r\n")
                .append(model).append("\r\n");
        sb.append("--").append(boundary).append("\r\n")
                .append("Content-Disposition: form-data; name=\"response_format\"\r\n\r\n")
                .append("verbose_json").append("\r\n");
        // Explicitly do NOT send language → auto-detect Indian + other languages
        sb.append("--").append(boundary).append("\r\n")
                .append("Content-Disposition: form-data; name=\"file\"; filename=\"").append(fileName).append("\"\r\n")
                .append("Content-Type: ").append(mime).append("\r\n\r\n");
        String partEnd = "\r\n--" + boundary + "--\r\n";
        byte[] p1 = sb.toString().getBytes(StandardCharsets.UTF_8);
        byte[] p2 = partEnd.getBytes(StandardCharsets.UTF_8);
        byte[] all = new byte[p1.length + audio.length + p2.length];
        System.arraycopy(p1, 0, all, 0, p1.length);
        System.arraycopy(audio, 0, all, p1.length, audio.length);
        System.arraycopy(p2, 0, all, p1.length + audio.length, p2.length);
        return all;
    }

    private AiInterpretation parseInterpretationJson(String contentText) throws Exception {
        String json = extractJsonObject(contentText);
        JsonNode node = mapper.readTree(json);
        AiInterpretation interpretation = new AiInterpretation();
        interpretation.summary = textOr(node, "summary", "Construction materials detected");
        interpretation.queryText = textOr(node, "queryText", interpretation.summary);
        interpretation.replyMessage = textOr(node, "replyMessage", interpretation.summary);
        interpretation.detectedLanguage = normalizeLang(textOr(node, "detectedLanguage", "en"));
        interpretation.detectedLanguageName = textOr(node, "detectedLanguageName",
                languageName(interpretation.detectedLanguage));
        interpretation.materials = toStringList(node.get("materials"));
        interpretation.intents = toStringList(node.get("intents"));
        interpretation.keywords = toStringList(node.get("keywords"));
        if (interpretation.keywords.isEmpty()) {
            interpretation.keywords.addAll(extractKeywords(interpretation.queryText.toLowerCase(Locale.ROOT)));
            interpretation.keywords.addAll(IndianLanguageLexicon.expand(interpretation.transcriptOriginal != null
                    ? interpretation.transcriptOriginal
                    : interpretation.summary));
        }
        return interpretation;
    }

    private AiInterpretation localInterpret(String query, String whisperLanguage, boolean fromWhisper) {
        AiInterpretation interpretation = new AiInterpretation();
        interpretation.transcriptOriginal = query;
        interpretation.queryText = query == null ? "" : query.trim();
        LanguageGuess guess = IndianLanguageLexicon.detectLanguage(interpretation.queryText);
        if (whisperLanguage != null && !whisperLanguage.isBlank()) {
            interpretation.detectedLanguage = normalizeLang(whisperLanguage);
            interpretation.detectedLanguageName = languageName(whisperLanguage);
        } else {
            interpretation.detectedLanguage = guess.code;
            interpretation.detectedLanguageName = guess.name;
        }
        interpretation.keywords.addAll(extractKeywords(interpretation.queryText.toLowerCase(Locale.ROOT)));
        interpretation.keywords.addAll(IndianLanguageLexicon.expand(interpretation.queryText));
        interpretation.materials.addAll(extractMaterials(String.join(" ", interpretation.keywords)));
        interpretation.intents.addAll(extractIntents(String.join(" ", interpretation.keywords)
                + " " + interpretation.queryText.toLowerCase(Locale.ROOT)));
        interpretation.summary = IndianLanguageLexicon.localizedSummary(
                interpretation.detectedLanguage, interpretation.materials, interpretation.queryText);
        interpretation.replyMessage = IndianLanguageLexicon.localizedReply(
                interpretation.detectedLanguage, interpretation.materials);
        interpretation.usedExternalAi = false;
        interpretation.providerMode = fromWhisper ? "stub-whisper" : "stub";
        return interpretation;
    }

    private AiInterpretation stubFromImage(String fileName, String hint) {
        String seed = (normalizeFileSeed(fileName) + " " + (hint == null ? "" : hint)).trim();
        if (seed.isBlank()) {
            seed = "cement brick pipe paint waterproof";
        }
        AiInterpretation interpretation = localInterpret(seed, null, false);
        interpretation.providerMode = "stub-vision";
        return interpretation;
    }

    private HandwrittenListExtraction stubHandwrittenList(String fileName, String hint) {
        String seed = (normalizeFileSeed(fileName) + "\n" + (hint == null ? "" : hint)).trim();
        if (seed.isBlank()) {
            seed = "10 bags cement\n5 PVC pipe\n2 tmt rod\nAsian paints 20L";
        }
        HandwrittenListExtraction extraction = new HandwrittenListExtraction();
        String[] lines = seed.split("[\\r\\n;,|]+");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isBlank()) continue;
            HandwrittenListItem item = parseStubLine(trimmed);
            extraction.items.add(item);
        }
        if (extraction.items.isEmpty()) {
            extraction.items.add(parseStubLine("cement 10 bags"));
        }
        LanguageGuess guess = IndianLanguageLexicon.detectLanguage(seed);
        extraction.detectedLanguage = guess.code;
        extraction.detectedLanguageName = guess.name;
        extraction.summary = "Read " + extraction.items.size() + " items from the list";
        extraction.replyMessage = IndianLanguageLexicon.localizedReply(guess.code, List.of("list"));
        if (extraction.replyMessage == null || extraction.replyMessage.isBlank()) {
            extraction.replyMessage = "Found " + extraction.items.size() + " items on your list.";
        }
        extraction.usedExternalAi = false;
        extraction.providerMode = "stub-list-vision";
        return extraction;
    }

    private HandwrittenListItem parseStubLine(String line) {
        Double qty = null;
        java.util.regex.Matcher matcher = java.util.regex.Pattern
                .compile("(\\d+(?:\\.\\d+)?)")
                .matcher(line);
        if (matcher.find()) {
            try {
                qty = Double.parseDouble(matcher.group(1));
            } catch (NumberFormatException ignored) {
                qty = null;
            }
        }
        String query = line.replaceAll("\\d+(?:\\.\\d+)?", " ").replaceAll("\\s+", " ").trim();
        HandwrittenListItem item = new HandwrittenListItem();
        item.rawText = line;
        item.quantity = qty;
        item.unit = "";
        item.queryText = query.isBlank() ? line : query;
        item.brandHint = "";
        item.detectedLanguage = IndianLanguageLexicon.detectLanguage(line).code;
        return item;
    }

    private HandwrittenListExtraction parseListExtractionJson(String contentText) throws Exception {
        String json = extractJsonObject(contentText);
        JsonNode node = mapper.readTree(json);
        HandwrittenListExtraction extraction = new HandwrittenListExtraction();
        extraction.summary = textOr(node, "summary", "Handwritten list detected");
        extraction.replyMessage = textOr(node, "replyMessage", extraction.summary);
        extraction.detectedLanguage = normalizeLang(textOr(node, "detectedLanguage", "en"));
        extraction.detectedLanguageName = textOr(node, "detectedLanguageName",
                languageName(extraction.detectedLanguage));
        JsonNode items = node.get("items");
        if (items != null && items.isArray()) {
            for (JsonNode itemNode : items) {
                HandwrittenListItem item = new HandwrittenListItem();
                item.rawText = textOr(itemNode, "rawText", textOr(itemNode, "queryText", ""));
                item.queryText = textOr(itemNode, "queryText", item.rawText);
                item.unit = textOr(itemNode, "unit", "");
                item.brandHint = textOr(itemNode, "brandHint", "");
                item.detectedLanguage = normalizeLang(textOr(itemNode, "detectedLanguage",
                        extraction.detectedLanguage));
                if (itemNode.has("quantity") && !itemNode.get("quantity").isNull()) {
                    item.quantity = itemNode.get("quantity").asDouble();
                }
                if (item.rawText != null && !item.rawText.isBlank()) {
                    extraction.items.add(item);
                }
            }
        }
        return extraction;
    }

    private String normalizeFileSeed(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "";
        }
        return fileName
                .replace('-', ' ')
                .replace('_', ' ')
                .replaceAll("(?i)\\.(jpe?g|png|webp|gif|heic|bmp)$", "")
                .trim();
    }

    private String stubTranscriptFromFileName(String fileName) {
        if (fileName != null && !fileName.isBlank()) {
            return normalizeFileSeed(fileName);
        }
        return "मुझे सीमेंट और वॉटरप्रूफिंग चाहिए";
    }

    private List<String> extractKeywords(String lower) {
        List<String> keywords = new ArrayList<>();
        // Longer tokens first so "cpvc" wins before substring "pvc".
        String[] candidates = {
                "waterproof", "electrical", "plumbing", "shuttering", "aggregate", "concrete",
                "adhesive", "emulsion", "enamel", "fitting", "primer", "helmet", "gloves",
                "plywood", "faucet", "shower", "terrace", "cement", "steel", "brick", "block",
                "paint", "putty", "drill", "valve", "socket", "elbow", "bend", "tee", "cpvc",
                "upvc", "pipe", "pvc", "swr", "opc", "ppc", "tmt", "rebar", "aac", "mcb",
                "wire", "cable", "switch", "sand", "tile", "tiles", "roof", "tank", "gi",
                "ss", "brass", "copper", "hinge", "cock", "tap", "basin", "mixer", "grout"
        };
        for (String c : candidates) {
            if (hasKeywordToken(lower, c) && !keywords.contains(c)) {
                keywords.add(c);
            }
        }
        return keywords;
    }

    /** Whole-token match so "pvc" does not fire inside "cpvc". */
    private boolean hasKeywordToken(String text, String keyword) {
        if (text == null || keyword == null || keyword.isBlank()) {
            return false;
        }
        for (String token : text.toLowerCase(Locale.ROOT).split("[^a-z0-9]+")) {
            if (token.equals(keyword)) {
                return true;
            }
        }
        return keyword.length() > 3 && text.contains(keyword);
    }

    private List<String> extractMaterials(String lower) {
        List<String> materials = new ArrayList<>();
        if (containsAny(lower, "cement", "opc", "ppc")) materials.add("cement");
        if (containsAny(lower, "concrete", "rmc", "m25")) materials.add("concrete");
        if (containsAny(lower, "steel", "tmt", "rebar")) materials.add("steel");
        if (containsAny(lower, "brick", "aac", "block")) materials.add("bricks");
        if (containsAny(lower, "pipe", "pvc", "cpvc", "plumbing", "elbow", "fitting", "bend")) materials.add("pipes");
        if (containsAny(lower, "wire", "electrical", "mcb", "switch")) materials.add("electrical");
        if (containsAny(lower, "paint", "primer", "putty")) materials.add("paint");
        if (containsAny(lower, "tile", "flooring")) materials.add("tiles");
        if (containsAny(lower, "roof", "membrane")) materials.add("roofing");
        if (containsAny(lower, "sand", "aggregate", "jelly")) materials.add("aggregates");
        if (containsAny(lower, "helmet", "gloves", "safety", "ppe")) materials.add("safety");
        if (containsAny(lower, "drill", "trowel", "tool")) materials.add("tools");
        if (containsAny(lower, "waterproof", "leak", "damp", "terrace")) materials.add("waterproofing");
        return materials;
    }

    private List<String> extractIntents(String lower) {
        List<String> intents = new ArrayList<>();
        if (containsAny(lower, "waterproof", "leak", "seepage", "damp")) intents.add("waterproofing");
        if (containsAny(lower, "plaster", "putty", "smooth")) intents.add("plastering");
        if (containsAny(lower, "paint", "colour", "color")) intents.add("painting");
        if (containsAny(lower, "wiring", "electrical", "switchboard")) intents.add("electrical-work");
        if (containsAny(lower, "plumb", "pipe", "bathroom", "tap")) intents.add("plumbing");
        if (containsAny(lower, "foundation", "slab", "column", "beam", "rcc")) intents.add("structural");
        if (containsAny(lower, "roof", "terrace")) intents.add("roofing");
        if (containsAny(lower, "tile", "floor")) intents.add("flooring");
        if (containsAny(lower, "safety", "helmet", "ppe")) intents.add("site-safety");
        return intents;
    }

    private boolean containsAny(String text, String... words) {
        for (String w : words) {
            if (hasKeywordToken(text, w)) return true;
        }
        return false;
    }

    private List<String> toStringList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            for (JsonNode n : node) {
                String v = n.asText("");
                if (!v.isBlank()) list.add(v.toLowerCase(Locale.ROOT));
            }
        }
        return list;
    }

    private String textOr(JsonNode node, String field, String fallback) {
        String v = node.path(field).asText("");
        return v.isBlank() ? fallback : v;
    }

    private String extractJsonObject(String content) {
        int start = content.indexOf('{');
        int end = content.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return content.substring(start, end + 1);
        }
        throw new IllegalStateException("Model response did not contain JSON: " + content);
    }

    private static final String WEBSITE_CATALOG_SYSTEM_PROMPT = """
            You are YellowKart's catalog ingestion assistant for Indian electrical / construction brands.
            Given a brand name and a list of URLs crawled from that brand's website sitemap, decide which
            URLs are individual PRODUCT pages (not blogs, about, careers, category indexes, PDF-only
            investor docs, or store locators) and extract catalog fields.
            Return ONLY valid JSON:
            {
              "notes": "short note about what you selected",
              "products": [
                {
                  "name": "Buyer-facing product name including brand when natural",
                  "catalogNo": "SKU / cat.no / product id if inferable from URL or empty string",
                  "sku": "same as catalogNo when unknown difference",
                  "description": "one short sentence",
                  "price": null,
                  "currency": "INR",
                  "category": "Electrical Materials",
                  "subcategory": "Switches or empty",
                  "imageUrl": "",
                  "sourceUrl": "exact URL from the input list",
                  "attributes": { "model": optional }
                }
              ]
            }
            Rules:
            - Only include true product detail pages.
            - Prefer catalogNo from URL path tokens (numeric ids, p-12345, sku-like segments).
            - price must be null unless clearly present in the URL text (almost never).
            - Do not invent prices.
            - Keep names concise and retail-like.
            - Respect maxProducts if provided.
            - This must work for ANY brand (Havells, Polycab, GM Modular, Goldmedal, Schneider, etc.)
              without brand-specific hardcoding.
            """;

    public WebsiteCatalogResponse extractWebsiteCatalog(WebsiteCatalogRequest request) {
        WebsiteCatalogResponse response = new WebsiteCatalogResponse();
        response.brand = request == null ? null : request.brand;
        response.websiteUrl = request == null ? null : request.websiteUrl;
        response.inputUrlCount = request == null || request.urls == null ? 0 : request.urls.size();

        if (request == null || request.urls == null || request.urls.isEmpty()) {
            response.notes = "No URLs provided";
            return response;
        }

        int max = request.maxProducts == null || request.maxProducts < 1
                ? 400
                : Math.min(request.maxProducts, 2000);

        if (isConfigured()) {
            try {
                List<String> urls = request.urls.stream()
                        .filter(u -> u != null && !u.isBlank())
                        .distinct()
                        .limit(Math.max(max * 3L, 120))
                        .toList();
                // Chunk so prompts stay within model context.
                int chunkSize = 80;
                for (int i = 0; i < urls.size() && response.products.size() < max; i += chunkSize) {
                    List<String> chunk = urls.subList(i, Math.min(i + chunkSize, urls.size()));
                    WebsiteCatalogResponse part = callWebsiteCatalogExtract(request, chunk, max - response.products.size());
                    response.usedExternalAi = true;
                    if (part.notes != null && response.notes == null) {
                        response.notes = part.notes;
                    }
                    for (WebsiteCatalogProduct product : part.products) {
                        if (response.products.size() >= max) {
                            break;
                        }
                        if (product != null && product.sourceUrl != null && product.name != null) {
                            response.products.add(product);
                        }
                    }
                }
                response.selectedUrlCount = response.products.size();
                if (response.notes == null || response.notes.isBlank()) {
                    response.notes = "AI selected product pages from sitemap URLs";
                }
                return response;
            } catch (Exception e) {
                LOG.error("Website catalog AI extract failed, using heuristic fallback", e);
                if (!stubEnabled) {
                    throw new IllegalStateException("Website catalog extract failed: " + e.getMessage(), e);
                }
            }
        } else if (!stubEnabled) {
            throw new IllegalStateException("OPENAI_API_KEY is required for website catalog extraction");
        }

        return stubWebsiteCatalog(request, max);
    }

    private WebsiteCatalogResponse callWebsiteCatalogExtract(WebsiteCatalogRequest request,
                                                             List<String> urls,
                                                             int remaining)
            throws Exception {
        ObjectNode root = mapper.createObjectNode();
        root.put("model", chatModel);
        root.put("temperature", 0.1);
        ArrayNode messages = root.putArray("messages");

        ObjectNode system = messages.addObject();
        system.put("role", "system");
        system.put("content", WEBSITE_CATALOG_SYSTEM_PROMPT);

        ObjectNode user = messages.addObject();
        user.put("role", "user");
        StringBuilder prompt = new StringBuilder();
        prompt.append("Brand: ").append(nullToEmpty(request.brand)).append('\n');
        prompt.append("Website: ").append(nullToEmpty(request.websiteUrl)).append('\n');
        prompt.append("Default category: ")
                .append(request.category == null || request.category.isBlank()
                        ? "Electrical Materials" : request.category)
                .append('\n');
        prompt.append("maxProducts for this chunk: ").append(Math.max(1, remaining)).append('\n');
        prompt.append("URLs:\n");
        for (String url : urls) {
            prompt.append("- ").append(url).append('\n');
        }
        prompt.append("Return JSON only.");
        user.put("content", prompt.toString());

        JsonNode body = postJson("/chat/completions", root);
        String contentText = body.path("choices").path(0).path("message").path("content").asText("");
        return parseWebsiteCatalogJson(contentText, request);
    }

    private WebsiteCatalogResponse parseWebsiteCatalogJson(String contentText, WebsiteCatalogRequest request)
            throws Exception {
        String json = extractJsonObject(contentText);
        JsonNode node = mapper.readTree(json);
        WebsiteCatalogResponse response = new WebsiteCatalogResponse();
        response.brand = request.brand;
        response.websiteUrl = request.websiteUrl;
        response.notes = textOr(node, "notes", "");
        response.usedExternalAi = true;
        JsonNode products = node.get("products");
        if (products != null && products.isArray()) {
            for (JsonNode p : products) {
                WebsiteCatalogProduct product = new WebsiteCatalogProduct();
                product.name = textOr(p, "name", null);
                product.catalogNo = emptyToNull(textOr(p, "catalogNo", ""));
                product.sku = emptyToNull(textOr(p, "sku", product.catalogNo == null ? "" : product.catalogNo));
                product.description = emptyToNull(textOr(p, "description", ""));
                if (p.has("price") && !p.get("price").isNull()) {
                    try {
                        product.price = p.get("price").asDouble();
                    } catch (Exception ignored) {
                        product.price = null;
                    }
                }
                product.currency = textOr(p, "currency", "INR");
                product.category = textOr(p, "category",
                        request.category == null || request.category.isBlank()
                                ? "Electrical Materials" : request.category);
                product.subcategory = emptyToNull(textOr(p, "subcategory", ""));
                product.imageUrl = emptyToNull(textOr(p, "imageUrl", ""));
                product.sourceUrl = emptyToNull(textOr(p, "sourceUrl", ""));
                JsonNode attrs = p.get("attributes");
                if (attrs != null && attrs.isObject()) {
                    attrs.fields().forEachRemaining(e -> {
                        if (e.getValue() != null && e.getValue().isValueNode()) {
                            String v = e.getValue().asText("");
                            if (!v.isBlank()) {
                                product.attributes.put(e.getKey(), v);
                            }
                        }
                    });
                }
                if (product.name != null && !product.name.isBlank() && product.sourceUrl != null) {
                    response.products.add(product);
                }
            }
        }
        response.selectedUrlCount = response.products.size();
        return response;
    }

    private WebsiteCatalogResponse stubWebsiteCatalog(WebsiteCatalogRequest request, int max) {
        WebsiteCatalogResponse response = new WebsiteCatalogResponse();
        response.brand = request.brand;
        response.websiteUrl = request.websiteUrl;
        response.usedExternalAi = false;
        response.notes = "heuristic product-URL filter (AI unavailable — top up OpenAI credits for full extraction)";
        response.inputUrlCount = request.urls.size();

        for (String url : request.urls) {
            if (response.products.size() >= max) {
                break;
            }
            String lower = url.toLowerCase(Locale.ROOT);
            boolean productish = lower.contains("/p/")
                    || lower.contains("/product/")
                    || lower.contains("/products/")
                    || lower.contains("portfolio_page")
                    || lower.contains("/catalog/product/")
                    || lower.matches(".*(/p-\\d+).*");
            if (!productish) {
                continue;
            }
            WebsiteCatalogProduct product = new WebsiteCatalogProduct();
            product.sourceUrl = url;
            product.category = request.category == null || request.category.isBlank()
                    ? "Electrical Materials" : request.category;
            product.currency = "INR";
            product.price = null;

            String path = url.replaceAll("^https?://[^/]+", "").replaceAll("[?#].*$", "");
            String[] parts = path.replaceAll("^/+|/+$", "").split("/");
            String slug = parts.length > 0 ? parts[parts.length - 1] : "product";
            String catalogNo = slug;

            // /p/{slug}/{id} → name from slug, catalog from id
            for (int i = 0; i < parts.length - 1; i++) {
                if ("p".equalsIgnoreCase(parts[i]) && i + 1 < parts.length) {
                    String candidate = parts[i + 1];
                    if (!candidate.isBlank() && !candidate.matches("^\\d+$")) {
                        slug = candidate;
                    }
                    if (i + 2 < parts.length && parts[i + 2].matches("^\\d+$")) {
                        catalogNo = parts[i + 2];
                    }
                    break;
                }
            }
            // /p-12345 after descriptive slug
            if (parts.length >= 2 && parts[parts.length - 1].matches("(?i)p-\\d+")) {
                catalogNo = parts[parts.length - 1].replaceAll("(?i)^p-", "");
                slug = parts[parts.length - 2];
            }
            if (path.matches("(?i).*/id/\\d+.*")) {
                catalogNo = path.replaceAll("(?i).*/id/(\\d+).*", "$1");
            }

            slug = slug.replaceAll("(?i)\\.html?", "");
            product.catalogNo = catalogNo;
            product.sku = catalogNo;
            String pretty = slug.replace('-', ' ').replace('_', ' ').trim();
            product.name = (request.brand == null ? "" : request.brand + " ") + pretty;
            if (catalogNo != null && !product.name.contains(catalogNo)) {
                product.name = product.name + " (" + catalogNo + ")";
            }
            product.description = "Imported from " + url;
            if (parts.length > 0) {
                product.subcategory = parts[0].replace('-', ' ');
            }
            response.products.add(product);
        }
        response.selectedUrlCount = response.products.size();
        return response;
    }

    private static String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private static String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String trimSlash(String url) {
        if (url.endsWith("/")) {
            return url.substring(0, url.length() - 1);
        }
        return url;
    }

    private String normalizeLang(String code) {
        if (code == null || code.isBlank()) return "en";
        String c = code.trim().toLowerCase(Locale.ROOT);
        if (c.length() > 3) {
            // Whisper sometimes returns full names
            for (Map.Entry<String, String> e : LANGUAGE_NAMES.entrySet()) {
                if (e.getValue().equalsIgnoreCase(c)) return e.getKey();
            }
        }
        return c;
    }

    private String languageName(String code) {
        String normalized = normalizeLang(code);
        return LANGUAGE_NAMES.getOrDefault(normalized, normalized);
    }

    private static final class WhisperResult {
        String text;
        String language;
    }

    static final class LanguageGuess {
        final String code;
        final String name;

        LanguageGuess(String code, String name) {
            this.code = code;
            this.name = name;
        }
    }
}
