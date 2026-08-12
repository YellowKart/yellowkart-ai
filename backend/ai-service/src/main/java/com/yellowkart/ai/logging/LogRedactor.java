package com.yellowkart.ai.logging;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.lang.reflect.Parameter;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Turns a method argument or return value into a log-safe string.
 *
 * Two independent layers, since either one alone missed a real case during
 * the pilot (a raw buyer JWT passed as a plain method argument -- no
 * "Bearer " prefix, and shorter than the old length-only cutoff, so it
 * logged in full):
 *  1. Parameter-NAME based: if the declared parameter name looks sensitive
 *     (buyerToken, password, authorization, ...), redact regardless of the
 *     value's shape. Relies on -parameters being on (it is, every service's
 *     compiler plugin already sets it).
 *  2. Content-based backstop: redact anything that structurally looks like
 *     a JWT (three dot-separated base64url segments) or a Bearer header
 *     value, independent of what it's called -- catches cases upstream
 *     services pass this value under a name we don't recognize.
 * Plus: known-sensitive JSON field names inside serialized objects, and a
 * length cap so one giant payload can't flood the logs.
 */
public final class LogRedactor {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final int MAX_LEN = 500;

    private static final Set<String> SENSITIVE_KEYS = Set.of(
            "password", "secret", "token", "authorization", "apikey", "api_key",
            "gatewaypaymentid", "signature", "accesstoken", "refreshtoken", "otp",
            "buyertoken", "jwt", "bearer");

    private static final Pattern SENSITIVE_JSON_FIELD = Pattern.compile(
            "(?i)\"(" + String.join("|", SENSITIVE_KEYS) + ")\"\\s*:\\s*\"[^\"]*\"");

    // Structural JWT match: header.payload.signature, each segment base64url.
    private static final Pattern JWT_SHAPE = Pattern.compile("^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$");

    private LogRedactor() {
    }

    public static String safeArgs(Parameter[] params, Object[] args) {
        if (args == null || args.length == 0) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < args.length; i++) {
            if (i > 0) {
                sb.append(", ");
            }
            boolean sensitiveByName = params != null && i < params.length && isSensitiveName(params[i].getName());
            sb.append(sensitiveByName ? "[REDACTED]" : safeValue(args[i]));
        }
        return truncate(sb.toString());
    }

    public static String safeResult(Object result) {
        return truncate(safeValue(result));
    }

    private static boolean isSensitiveName(String paramName) {
        String lower = paramName.toLowerCase();
        return SENSITIVE_KEYS.stream().anyMatch(lower::contains);
    }

    private static String safeValue(Object value) {
        if (value == null) {
            return "null";
        }
        if (value instanceof String s) {
            return looksLikeSecret(s) ? "[REDACTED]" : s;
        }
        if (isSimple(value)) {
            return String.valueOf(value);
        }
        try {
            return redactJson(MAPPER.writeValueAsString(value));
        } catch (Exception e) {
            return value.getClass().getSimpleName() + "(unserializable: " + e.getMessage() + ")";
        }
    }

    private static boolean isSimple(Object v) {
        return v instanceof Number || v instanceof Boolean || v instanceof Enum;
    }

    // Content-based backstop, independent of parameter name: raw JWTs (our
    // own buyer tokens and Auth0 tokens alike), "Bearer ..." header values,
    // and any other suspiciously long opaque string.
    private static boolean looksLikeSecret(String s) {
        return s.regionMatches(true, 0, "Bearer ", 0, 7)
                || JWT_SHAPE.matcher(s).matches()
                || s.length() > 200;
    }

    private static String redactJson(String json) {
        return SENSITIVE_JSON_FIELD.matcher(json).replaceAll(m -> "\"" + m.group(1) + "\":\"[REDACTED]\"");
    }

    private static String truncate(String s) {
        return s.length() > MAX_LEN ? s.substring(0, MAX_LEN) + "...(truncated, " + s.length() + " chars)" : s;
    }
}
