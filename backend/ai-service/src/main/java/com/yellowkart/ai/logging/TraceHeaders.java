package com.yellowkart.ai.logging;

import org.jboss.logging.MDC;

/**
 * Reads the current request's correlation id (set by RequestIdFilter) so
 * outbound calls to other services can forward it on X-Request-Id --
 * that's what makes a single buyer action traceable end to end across
 * service boundaries instead of just within this one.
 */
public final class TraceHeaders {

    private TraceHeaders() {
    }

    public static String currentRequestId() {
        Object id = MDC.get(RequestIdFilter.MDC_KEY);
        return id instanceof String s ? s : "";
    }
}
