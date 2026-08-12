package com.yellowkart.ai.logging;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;
import org.jboss.logging.MDC;

import java.util.UUID;

/**
 * Reads X-Request-Id off an inbound request if the caller already set one
 * (web/mobile apps generate it at the edge; another service forwards the one
 * it was called with), otherwise mints a fresh one. Puts it in MDC so every
 * log line for this request -- including TracingInterceptor's -- carries it
 * automatically via %X{requestId} in the log format, and echoes it back on
 * the response so the caller can correlate. See TraceHeaders for propagating
 * it on outbound calls this service makes to others.
 *
 * Also logs one INFO-level line per request (method, path, status, time
 * taken) regardless of the DEBUG-level per-method tracing being on --
 * this is the one line that should always be there for "what did this
 * service actually see and how long did it take."
 */
@Provider
public class RequestIdFilter implements ContainerRequestFilter, ContainerResponseFilter {

    public static final String HEADER = "X-Request-Id";
    public static final String MDC_KEY = "requestId";
    private static final String START_TIME_PROPERTY = "requestStartNanos";

    private static final Logger LOG = Logger.getLogger("com.yellowkart.ai.logging.http");

    @Override
    public void filter(ContainerRequestContext requestContext) {
        String requestId = requestContext.getHeaderString(HEADER);
        if (requestId == null || requestId.isBlank()) {
            requestId = UUID.randomUUID().toString();
        }
        MDC.put(MDC_KEY, requestId);
        requestContext.setProperty(MDC_KEY, requestId);
        requestContext.setProperty(START_TIME_PROPERTY, System.nanoTime());
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        Object requestId = requestContext.getProperty(MDC_KEY);
        if (requestId != null) {
            responseContext.getHeaders().putSingle(HEADER, requestId.toString());
        }

        Object startNanos = requestContext.getProperty(START_TIME_PROPERTY);
        long tookMs = startNanos instanceof Long start ? (System.nanoTime() - start) / 1_000_000 : -1;
        LOG.infof("%s %s -> %d (%dms)",
                requestContext.getMethod(), requestContext.getUriInfo().getPath(),
                responseContext.getStatus(), tookMs);

        MDC.remove(MDC_KEY);
    }
}
