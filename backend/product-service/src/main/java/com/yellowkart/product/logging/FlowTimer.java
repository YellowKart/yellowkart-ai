package com.yellowkart.product.logging;

import org.jboss.logging.Logger;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Tracks multi-step flows and individual operations with elapsed time,
 * never logging sensitive payloads.
 */
public final class FlowTimer {

    private final Logger log;
    private final String flowName;
    private final String flowId;
    private final long startedAtNanos;
    private final Map<String, Object> context;

    private FlowTimer(Logger log, String flowName, Map<String, Object> context) {
        this.log = log;
        this.flowName = flowName;
        this.flowId = UUID.randomUUID().toString().substring(0, 8);
        this.startedAtNanos = System.nanoTime();
        this.context = context == null
                ? new LinkedHashMap<>()
                : new LinkedHashMap<>(LogSanitizer.sanitizeMap(context));
        this.log.info("FLOW_START flow=" + flowName + " flowId=" + flowId + " context=" + this.context);
    }

    public static FlowTimer start(Logger log, String flowName) {
        return new FlowTimer(log, flowName, null);
    }

    public static FlowTimer start(Logger log, String flowName, Map<String, Object> context) {
        return new FlowTimer(log, flowName, context);
    }

    public String flowId() {
        return flowId;
    }

    public void step(String stepName) {
        step(stepName, null);
    }

    public void step(String stepName, Map<String, Object> meta) {
        long elapsedMs = elapsedMs();
        Map<String, Object> safeMeta = meta == null ? Map.of() : LogSanitizer.sanitizeMap(meta);
        log.info("FLOW_STEP flow=" + flowName
                + " flowId=" + flowId
                + " step=" + stepName
                + " elapsedMs=" + elapsedMs
                + " meta=" + safeMeta);
    }

    public void success() {
        success(null);
    }

    public void success(Map<String, Object> meta) {
        Map<String, Object> safeMeta = meta == null ? Map.of() : LogSanitizer.sanitizeMap(meta);
        log.info("FLOW_END flow=" + flowName
                + " flowId=" + flowId
                + " status=success"
                + " durationMs=" + elapsedMs()
                + " meta=" + safeMeta);
    }

    public void failure(Throwable error) {
        failure(error, null);
    }

    public void failure(Throwable error, Map<String, Object> meta) {
        Map<String, Object> safeMeta = meta == null ? new LinkedHashMap<>() : new LinkedHashMap<>(LogSanitizer.sanitizeMap(meta));
        if (error != null) {
            safeMeta.put("errorType", error.getClass().getSimpleName());
            safeMeta.put("errorMessage", LogSanitizer.sanitizeText(String.valueOf(error.getMessage())));
        }
        log.error("FLOW_END flow=" + flowName
                + " flowId=" + flowId
                + " status=failure"
                + " durationMs=" + elapsedMs()
                + " meta=" + safeMeta);
    }

    public <T> T time(String operation, Supplier<T> supplier) {
        return time(operation, null, supplier);
    }

    public <T> T time(String operation, Map<String, Object> meta, Supplier<T> supplier) {
        long start = System.nanoTime();
        Map<String, Object> safeMeta = meta == null ? Map.of() : LogSanitizer.sanitizeMap(meta);
        log.info("OP_START flow=" + flowName
                + " flowId=" + flowId
                + " op=" + operation
                + " meta=" + safeMeta);
        try {
            T result = supplier.get();
            log.info("OP_END flow=" + flowName
                    + " flowId=" + flowId
                    + " op=" + operation
                    + " status=success"
                    + " durationMs=" + nanosToMs(System.nanoTime() - start));
            return result;
        } catch (RuntimeException ex) {
            log.error("OP_END flow=" + flowName
                    + " flowId=" + flowId
                    + " op=" + operation
                    + " status=failure"
                    + " durationMs=" + nanosToMs(System.nanoTime() - start)
                    + " errorType=" + ex.getClass().getSimpleName()
                    + " errorMessage=" + LogSanitizer.sanitizeText(String.valueOf(ex.getMessage())));
            throw ex;
        }
    }

    public void time(String operation, Runnable runnable) {
        time(operation, null, () -> {
            runnable.run();
            return null;
        });
    }

    public static <T> T timeOperation(Logger log, String operation, Supplier<T> supplier) {
        return timeOperation(log, operation, null, supplier);
    }

    public static <T> T timeOperation(
            Logger log,
            String operation,
            Map<String, Object> meta,
            Supplier<T> supplier
    ) {
        long start = System.nanoTime();
        Map<String, Object> safeMeta = meta == null ? Map.of() : LogSanitizer.sanitizeMap(meta);
        log.info("OP_START op=" + operation + " meta=" + safeMeta);
        try {
            T result = supplier.get();
            log.info("OP_END op=" + operation
                    + " status=success"
                    + " durationMs=" + nanosToMs(System.nanoTime() - start));
            return result;
        } catch (RuntimeException ex) {
            log.error("OP_END op=" + operation
                    + " status=failure"
                    + " durationMs=" + nanosToMs(System.nanoTime() - start)
                    + " errorType=" + ex.getClass().getSimpleName()
                    + " errorMessage=" + LogSanitizer.sanitizeText(String.valueOf(ex.getMessage())));
            throw ex;
        }
    }

    private long elapsedMs() {
        return nanosToMs(System.nanoTime() - startedAtNanos);
    }

    private static long nanosToMs(long nanos) {
        return nanos / 1_000_000L;
    }
}
