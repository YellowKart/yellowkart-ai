package com.yellowkart.notification.logging;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

import java.io.IOException;

/**
 * Logs every HTTP request/response with duration. Headers and query values
 * that look sensitive are redacted.
 */
@Provider
@Priority(Priorities.USER)
public class RequestLoggingFilter implements ContainerRequestFilter, ContainerResponseFilter {

    private static final Logger LOG = Logger.getLogger(RequestLoggingFilter.class);
    private static final String START_NS = "yk.logging.startNanos";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        requestContext.setProperty(START_NS, System.nanoTime());
        String path = LogSanitizer.summarizePath(requestContext.getUriInfo().getRequestUri().getRawPath()
                + (requestContext.getUriInfo().getRequestUri().getRawQuery() == null
                ? ""
                : "?" + requestContext.getUriInfo().getRequestUri().getRawQuery()));
        String contentType = requestContext.getHeaderString("Content-Type");
        LOG.info("HTTP_START method=" + requestContext.getMethod()
                + " path=" + path
                + " contentType=" + (contentType == null ? "-" : contentType));
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
            throws IOException {
        Object start = requestContext.getProperty(START_NS);
        long durationMs = start instanceof Long
                ? (System.nanoTime() - (Long) start) / 1_000_000L
                : -1L;
        String path = LogSanitizer.summarizePath(requestContext.getUriInfo().getRequestUri().getRawPath()
                + (requestContext.getUriInfo().getRequestUri().getRawQuery() == null
                ? ""
                : "?" + requestContext.getUriInfo().getRequestUri().getRawQuery()));
        LOG.info("HTTP_END method=" + requestContext.getMethod()
                + " path=" + path
                + " status=" + responseContext.getStatus()
                + " durationMs=" + durationMs);
    }
}
