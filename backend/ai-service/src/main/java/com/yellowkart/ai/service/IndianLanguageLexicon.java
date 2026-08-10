package com.yellowkart.ai.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import com.yellowkart.ai.logging.YkTrace;

/**
 * Lightweight Indian language / slang lexicon for construction shopping.
 * Expands vernacular terms into English catalog keywords and guesses language when OpenAI is offline.
 */
public final class IndianLanguageLexicon {

    private static final Pattern DEVANAGARI = Pattern.compile("[\\u0900-\\u097F]");

    private static final Pattern BENGALI = Pattern.compile("[\\u0980-\\u09FF]");

    private static final Pattern TAMIL = Pattern.compile("[\\u0B80-\\u0BFF]");

    private static final Pattern TELUGU = Pattern.compile("[\\u0C00-\\u0C7F]");

    private static final Pattern KANNADA = Pattern.compile("[\\u0C80-\\u0CFF]");

    private static final Pattern MALAYALAM = Pattern.compile("[\\u0D00-\\u0D7F]");

    private static final Pattern GUJARATI = Pattern.compile("[\\u0A80-\\u0AFF]");

    private static final Pattern GURMUKHI = Pattern.compile("[\\u0A00-\\u0A7F]");

    private static final Pattern ODIA = Pattern.compile("[\\u0B00-\\u0B7F]");

    /**
     * Vernacular / slang tokens → English catalog keywords.
     * Includes Hindi, Hinglish spellings, and common regional spoken forms in Latin script.
     */
    private static final Map<String, List<String>> TERM_MAP = Map.ofEntries(Map.entry("सीमेंट", List.of("cement")), Map.entry("सीमेन्ट", List.of("cement")), Map.entry("cement", List.of("cement")), Map.entry("sement", List.of("cement")), Map.entry("simment", List.of("cement")), Map.entry("कंक्रीट", List.of("concrete")), Map.entry("concrete", List.of("concrete")), Map.entry("लोहा", List.of("steel", "tmt")), Map.entry("सराया", List.of("steel", "tmt", "rebar")), Map.entry("सरिया", List.of("steel", "tmt", "rebar")), Map.entry("sariya", List.of("steel", "tmt", "rebar")), Map.entry("tmt", List.of("steel", "tmt")), Map.entry("rod", List.of("steel", "tmt")), Map.entry("ईंट", List.of("brick")), Map.entry("eent", List.of("brick")), Map.entry("int", List.of("brick")), Map.entry("brick", List.of("brick")), Map.entry("ब्लॉक", List.of("block", "aac")), Map.entry("pipe", List.of("pipe", "plumbing")), Map.entry("पाइप", List.of("pipe", "plumbing")), Map.entry("नल", List.of("pipe", "plumbing", "faucet")), Map.entry("टोंटी", List.of("faucet", "plumbing")), Map.entry("tap", List.of("faucet", "plumbing")), Map.entry("रंग", List.of("paint")), Map.entry("पेन्ट", List.of("paint")), Map.entry("paint", List.of("paint")), Map.entry("पुट्टी", List.of("putty")), Map.entry("putty", List.of("putty")), Map.entry("प्लास्टर", List.of("plaster", "putty")), Map.entry("रेत", List.of("sand")), Map.entry("ret", List.of("sand")), Map.entry("बजरी", List.of("aggregate")), Map.entry("gitti", List.of("aggregate")), Map.entry("jelly", List.of("aggregate")), Map.entry("टाइल", List.of("tile")), Map.entry("tile", List.of("tile")), Map.entry("छत", List.of("roof", "terrace")), Map.entry("टरेस", List.of("terrace", "waterproof")), Map.entry("terrace", List.of("terrace", "waterproof")), Map.entry("वाटरप्रूफ", List.of("waterproof")), Map.entry("waterproof", List.of("waterproof")), Map.entry("रिसाव", List.of("waterproof", "leak")), Map.entry("सेपेज", List.of("waterproof", "leak")), Map.entry("leak", List.of("waterproof", "leak")), Map.entry("तार", List.of("wire", "electrical")), Map.entry("wire", List.of("wire", "electrical")), Map.entry("स्विच", List.of("switch", "electrical")), Map.entry("हेलमेट", List.of("helmet", "safety")), Map.entry("helmet", List.of("helmet", "safety")), Map.entry("drilling", List.of("drill", "tool")), Map.entry("ड्रिल", List.of("drill", "tool")), // Common slang / code-mix verbs that hint shopping intent (ignored as materials)
    Map.entry("chahiye", List.of()), Map.entry("चाहिए", List.of()), Map.entry("vena", List.of()), Map.entry("venum", List.of()), Map.entry("kavali", List.of()), Map.entry("bekku", List.of()), Map.entry("vendera", List.of()), Map.entry("lagao", List.of("paint")), Map.entry("lagana", List.of("paint")));

    private IndianLanguageLexicon() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("IndianLanguageLexicon", "<init>")) {
        }
    }

    public static List<String> expand(String text) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("IndianLanguageLexicon", "expand")) {
            Set<String> out = new LinkedHashSet<>();
            if (text == null || text.isBlank()) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("IndianLanguageLexicon", "expand", "b1")) {
                    return List.of();
                }
            }
            String lower = text.toLowerCase(Locale.ROOT);
            Set<String> latinTokens = new LinkedHashSet<>();
            for (String part : lower.split("[^a-z0-9\\u0900-\\u097F]+")) {
                try (YkTrace.Scope __ykBlock3 = YkTrace.block("IndianLanguageLexicon", "expand", "b3")) {
                    if (!part.isBlank()) {
                        try (YkTrace.Scope __ykBlock2 = YkTrace.block("IndianLanguageLexicon", "expand", "b2")) {
                            latinTokens.add(part);
                        }
                    }
                }
            }
            for (Map.Entry<String, List<String>> entry : TERM_MAP.entrySet()) {
                try (YkTrace.Scope __ykBlock8 = YkTrace.block("IndianLanguageLexicon", "expand", "b8")) {
                    String key = entry.getKey();
                    String keyLower = key.toLowerCase(Locale.ROOT);
                    boolean hit;
                    // Short Latin keys (e.g. "int" for ईंट) must be whole tokens —
                    // never substring matches inside "paint", "point", etc.
                    if (key.length() <= 3 && key.chars().allMatch(c -> c < 128)) {
                        try (YkTrace.Scope __ykBlock6 = YkTrace.block("IndianLanguageLexicon", "expand", "b6")) {
                            hit = latinTokens.contains(keyLower);
                        }
                    } else if (DEVANAGARI.matcher(key).find() || BENGALI.matcher(key).find() || TAMIL.matcher(key).find() || TELUGU.matcher(key).find() || KANNADA.matcher(key).find() || MALAYALAM.matcher(key).find() || GUJARATI.matcher(key).find() || GURMUKHI.matcher(key).find() || ODIA.matcher(key).find()) {
                        try (YkTrace.Scope __ykBlock4 = YkTrace.block("IndianLanguageLexicon", "expand", "b4")) {
                            hit = text.contains(key);
                        }
                    } else {
                        try (YkTrace.Scope __ykBlock5 = YkTrace.block("IndianLanguageLexicon", "expand", "b5")) {
                            hit = latinTokens.contains(keyLower) || (keyLower.length() > 3 && lower.contains(keyLower));
                        }
                    }
                    if (hit) {
                        try (YkTrace.Scope __ykBlock7 = YkTrace.block("IndianLanguageLexicon", "expand", "b7")) {
                            out.addAll(entry.getValue());
                        }
                    }
                }
            }
            return new ArrayList<>(out);
        }
    }

    public static OpenAiClient.LanguageGuess detectLanguage(String text) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("IndianLanguageLexicon", "detectLanguage")) {
            if (text == null || text.isBlank()) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("IndianLanguageLexicon", "detectLanguage", "b1")) {
                    return new OpenAiClient.LanguageGuess("en", "English");
                }
            }
            if (DEVANAGARI.matcher(text).find()) {
                try (YkTrace.Scope __ykBlock3 = YkTrace.block("IndianLanguageLexicon", "detectLanguage", "b3")) {
                    // Could be Hindi/Marathi/Sanskrit; default Hindi for construction retail
                    String lower = text.toLowerCase(Locale.ROOT);
                    if (lower.contains("आहे") || lower.contains("हवे")) {
                        try (YkTrace.Scope __ykBlock2 = YkTrace.block("IndianLanguageLexicon", "detectLanguage", "b2")) {
                            return new OpenAiClient.LanguageGuess("mr", "Marathi");
                        }
                    }
                    return new OpenAiClient.LanguageGuess("hi", "Hindi");
                }
            }
            if (BENGALI.matcher(text).find())
                return new OpenAiClient.LanguageGuess("bn", "Bengali");
            if (TAMIL.matcher(text).find())
                return new OpenAiClient.LanguageGuess("ta", "Tamil");
            if (TELUGU.matcher(text).find())
                return new OpenAiClient.LanguageGuess("te", "Telugu");
            if (KANNADA.matcher(text).find())
                return new OpenAiClient.LanguageGuess("kn", "Kannada");
            if (MALAYALAM.matcher(text).find())
                return new OpenAiClient.LanguageGuess("ml", "Malayalam");
            if (GUJARATI.matcher(text).find())
                return new OpenAiClient.LanguageGuess("gu", "Gujarati");
            if (GURMUKHI.matcher(text).find())
                return new OpenAiClient.LanguageGuess("pa", "Punjabi");
            if (ODIA.matcher(text).find())
                return new OpenAiClient.LanguageGuess("or", "Odia");
            String lower = text.toLowerCase(Locale.ROOT);
            if (containsAny(lower, "chahiye", "mujhe", "krke", "karna", "bhai", "sariya", "eent")) {
                try (YkTrace.Scope __ykBlock4 = YkTrace.block("IndianLanguageLexicon", "detectLanguage", "b4")) {
                    return new OpenAiClient.LanguageGuess("hi", "Hindi (Hinglish)");
                }
            }
            if (containsAny(lower, "venum", "vena", "romba", "ille")) {
                try (YkTrace.Scope __ykBlock5 = YkTrace.block("IndianLanguageLexicon", "detectLanguage", "b5")) {
                    return new OpenAiClient.LanguageGuess("ta", "Tamil (Tanglish)");
                }
            }
            if (containsAny(lower, "kavali", "cheyali", "ledhu")) {
                try (YkTrace.Scope __ykBlock6 = YkTrace.block("IndianLanguageLexicon", "detectLanguage", "b6")) {
                    return new OpenAiClient.LanguageGuess("te", "Telugu (Tenglish)");
                }
            }
            if (containsAny(lower, "bekku", "illa", "madi")) {
                try (YkTrace.Scope __ykBlock7 = YkTrace.block("IndianLanguageLexicon", "detectLanguage", "b7")) {
                    return new OpenAiClient.LanguageGuess("kn", "Kannada");
                }
            }
            if (containsAny(lower, "venda", "alle", "aanu")) {
                try (YkTrace.Scope __ykBlock8 = YkTrace.block("IndianLanguageLexicon", "detectLanguage", "b8")) {
                    return new OpenAiClient.LanguageGuess("ml", "Malayalam");
                }
            }
            if (containsAny(lower, "joiye", "bhai", "kyare")) {
                try (YkTrace.Scope __ykBlock9 = YkTrace.block("IndianLanguageLexicon", "detectLanguage", "b9")) {
                    return new OpenAiClient.LanguageGuess("gu", "Gujarati");
                }
            }
            return new OpenAiClient.LanguageGuess("en", "English");
        }
    }

    public static String localizedSummary(String lang, List<String> materials, String query) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("IndianLanguageLexicon", "localizedSummary")) {
            String mat = materials == null || materials.isEmpty() ? "construction materials" : String.join(", ", materials);
            return switch(normalize(lang)) {
                case "hi" ->
                    "आपको इन निर्माण सामग्री की जरूरत लग रही है: " + mat;
                case "bn" ->
                    "আপনার সম্ভবত এই নির্মাণ সামগ্রী দরকার: " + mat;
                case "ta" ->
                    "உங்களுக்கு இந்த கட்டுமான பொருட்கள் தேவைப்படலாம்: " + mat;
                case "te" ->
                    "మీకు ఈ నిర్మాణ సామగ్రి కావాలని అనిపిస్తోంది: " + mat;
                case "mr" ->
                    "तुम्हाला या बांधकाम साहित्याची गरज आहे असे दिसते: " + mat;
                case "gu" ->
                    "તમને આ બાંધકામ સામગ્રી જોઈએ તેમ લાગે છે: " + mat;
                case "kn" ->
                    "ನಿಮಗೆ ಈ ನಿರ್ಮಾಣ ಸಾಮಗ್ರಿ ಬೇಕಾಗಬಹುದು: " + mat;
                case "ml" ->
                    "നിങ്ങൾക്ക് ഈ നിർമ്മാണ സാധനങ്ങൾ വേണ്ടി വന്നേക്കാം: " + mat;
                case "pa" ->
                    "ਤੁਹਾਨੂੰ ਇਹ ਉਸਾਰੀ ਸਮੱਗਰੀ ਚਾਹੀਦੀ ਲੱਗਦੀ ਹੈ: " + mat;
                case "ur" ->
                    "آپ کو یہ تعمیراتی سامان درکار معلوم ہوتا ہے: " + mat;
                default ->
                    "It looks like you need: " + mat + (query == null || query.isBlank() ? "" : " (" + query + ")");
            };
        }
    }

    public static String localizedReply(String lang, List<String> materials) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("IndianLanguageLexicon", "localizedReply")) {
            String mat = materials == null || materials.isEmpty() ? "products" : String.join(", ", materials);
            return switch(normalize(lang)) {
                case "hi" ->
                    "ठीक है! YellowKart पर आपके लिए " + mat + " के मिलते-जुलते प्रोडक्ट सुझा रहे हैं।";
                case "bn" ->
                    "ঠিক আছে! YellowKart-এ " + mat + " সম্পর্কিত পণ্য সাজেস্ট করছি।";
                case "ta" ->
                    "சரி! YellowKart-இல் " + mat + " தொடர்பான பொருட்களை பரிந்துரைக்கிறோம்.";
                case "te" ->
                    "సరే! YellowKartలో " + mat + " కి సంబంధించిన ఉత్పత్తులు సూచిస్తున్నాం.";
                case "mr" ->
                    "ठीक आहे! YellowKart वर " + mat + " संबंधित उत्पादने सुचवत आहोत.";
                case "gu" ->
                    "બરાબર! YellowKart પર " + mat + " સંબંધિત પ્રોડક્ટ્સ સૂચવી રહ્યા છીએ.";
                case "kn" ->
                    "ಸರಿ! YellowKartನಲ್ಲಿ " + mat + " ಸಂಬಂಧಿತ ಉತ್ಪನ್ನಗಳನ್ನು ಸೂಚಿಸುತ್ತಿದ್ದೇವೆ.";
                case "ml" ->
                    "ശരി! YellowKart-ൽ " + mat + " അനുയോജ്യമായ ഉൽപ്പന്നങ്ങൾ നിർദ്ദേശിക്കുന്നു.";
                case "pa" ->
                    "ਠੀਕ ਹੈ! YellowKart ਤੇ " + mat + " ਨਾਲ ਮਿਲਦੇ ਉਤਪਾਦ ਸੁਝਾ ਰਹੇ ਹਾਂ.";
                case "ur" ->
                    "ٹھیک ہے! YellowKart پر " + mat + " سے متعلق مصنوعات تجویز کر رہے ہیں۔";
                default ->
                    "Got it! Suggesting YellowKart products related to " + mat + ".";
            };
        }
    }

    private static String normalize(String lang) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("IndianLanguageLexicon", "normalize")) {
            if (lang == null || lang.isBlank())
                return "en";
            String c = lang.toLowerCase(Locale.ROOT);
            if (c.startsWith("hi"))
                return "hi";
            if (c.length() >= 2)
                return c.substring(0, 2);
            return c;
        }
    }

    private static boolean containsAny(String text, String... words) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("IndianLanguageLexicon", "containsAny")) {
            for (String w : words) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("IndianLanguageLexicon", "containsAny", "b1")) {
                    if (text.contains(w))
                        return true;
                }
            }
            return false;
        }
    }
}
