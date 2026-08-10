package com.yellowkart.product.logging;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Redacts secrets, credentials, payment data, and other sensitive values
 * before anything is written to logs.
 */
public final class LogSanitizer {

    public static final String REDACTED = "[REDACTED]";

    private static final Set<String> SENSITIVE_KEYS = new HashSet<>(Arrays.asList(
            "password",
            "passwd",
            "pwd",
            "otp",
            "pin",
            "token",
            "access_token",
            "accesstoken",
            "refresh_token",
            "refreshtoken",
            "id_token",
            "idtoken",
            "authorization",
            "auth",
            "client_secret",
            "clientsecret",
            "secret",
            "apikey",
            "api_key",
            "x-api-key",
            "cookie",
            "set-cookie",
            "session",
            "sessionid",
            "jwt",
            "bearer",
            "cardnumber",
            "card_number",
            "cvv",
            "cvc",
            "pan",
            "aadhaar",
            "aadhar",
            "ssn",
            "accountnumber",
            "account_number",
            "ifsc",
            "upi",
            "vpa",
            "razorpay_key",
            "razorpaykey",
            "razorpay_secret",
            "twilio",
            "auth_token",
            "authtoken"
    ));

    private static final Pattern BEARER_PATTERN =
            Pattern.compile("(?i)(bearer\\s+)[a-z0-9\\-_\\.]+");
    private static final Pattern OTP_PATTERN =
            Pattern.compile("(?i)(\\botp\\b\\s*[:=]\\s*)\\d{4,8}");
    private static final Pattern LONG_DIGIT_PATTERN =
            Pattern.compile("\\b\\d{12,19}\\b");

    private LogSanitizer() {
    }

    public static boolean isSensitiveKey(String key) {
        if (key == null || key.isBlank()) {
            return false;
        }
        String normalized = key.toLowerCase(Locale.ROOT)
                .replace("-", "")
                .replace("_", "");
        for (String sensitive : SENSITIVE_KEYS) {
            String candidate = sensitive.replace("-", "").replace("_", "");
            if (normalized.equals(candidate) || normalized.contains(candidate)) {
                return true;
            }
        }
        return false;
    }

    public static String sanitizeText(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        String sanitized = BEARER_PATTERN.matcher(input).replaceAll("$1" + REDACTED);
        sanitized = OTP_PATTERN.matcher(sanitized).replaceAll("$1" + REDACTED);
        sanitized = LONG_DIGIT_PATTERN.matcher(sanitized).replaceAll(REDACTED);
        return sanitized;
    }

    public static String sanitizeHeaderValue(String headerName, String value) {
        if (value == null) {
            return null;
        }
        if (isSensitiveKey(headerName)) {
            return REDACTED;
        }
        return sanitizeText(value);
    }

    public static Object sanitizeValue(String key, Object value) {
        if (value == null) {
            return null;
        }
        if (isSensitiveKey(key)) {
            return REDACTED;
        }
        if (value instanceof Map<?, ?> map) {
            return sanitizeMap(map);
        }
        if (value instanceof Iterable<?> iterable) {
            return sanitizeIterable(iterable);
        }
        if (value instanceof Object[] array) {
            return Arrays.stream(array)
                    .map(item -> sanitizeValue(null, item))
                    .toArray();
        }
        if (value instanceof CharSequence) {
            return sanitizeText(value.toString());
        }
        return value;
    }

    public static Map<String, Object> sanitizeMap(Map<?, ?> input) {
        if (input == null || input.isEmpty()) {
            return Collections.emptyMap();
        }
        Map<String, Object> out = new java.util.LinkedHashMap<>();
        for (Map.Entry<?, ?> entry : input.entrySet()) {
            String key = entry.getKey() == null ? "null" : String.valueOf(entry.getKey());
            out.put(key, sanitizeValue(key, entry.getValue()));
        }
        return out;
    }

    private static Object sanitizeIterable(Iterable<?> iterable) {
        java.util.List<Object> out = new java.util.ArrayList<>();
        for (Object item : iterable) {
            out.add(sanitizeValue(null, item));
        }
        return out;
    }

    public static String summarizePath(String path) {
        if (path == null) {
            return "";
        }
        int queryIdx = path.indexOf('?');
        if (queryIdx < 0) {
            return path;
        }
        String base = path.substring(0, queryIdx);
        String query = path.substring(queryIdx + 1);
        StringBuilder sanitizedQuery = new StringBuilder();
        for (String part : query.split("&")) {
            if (part.isEmpty()) {
                continue;
            }
            if (sanitizedQuery.length() > 0) {
                sanitizedQuery.append('&');
            }
            int eq = part.indexOf('=');
            if (eq < 0) {
                sanitizedQuery.append(part);
                continue;
            }
            String key = part.substring(0, eq);
            String value = part.substring(eq + 1);
            sanitizedQuery.append(key).append('=');
            sanitizedQuery.append(isSensitiveKey(key) ? REDACTED : sanitizeText(value));
        }
        return base + "?" + sanitizedQuery;
    }
}
