package com.yellowkart.ai.logging;

import jakarta.annotation.Priority;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import org.jboss.logging.Logger;

/**
 * Backs the @Traced annotation: logs entry (class.method + args), exit
 * (return value + time taken), and failure (exception + time taken to
 * failure) for every method on an @Traced class. Values are passed through
 * LogRedactor first so secrets never reach the logs. requestId comes from
 * MDC (set by RequestIdFilter for the inbound HTTP request), so every line
 * for a single request -- across every class it passes through -- carries
 * the same id and can be grepped together.
 */
@Traced
@Interceptor
@Priority(Interceptor.Priority.APPLICATION)
public class TracingInterceptor {

    private static final long SLOW_THRESHOLD_MS = 1000;

    // Fixed category (not ctx.getTarget().getClass()) so
    // quarkus.log.category."com.yellowkart.ai.logging".level actually controls
    // every trace line from one place, regardless of which @Traced class
    // logged it -- the class/method name is already in the message itself.
    private static final Logger LOG = Logger.getLogger("com.yellowkart.ai.logging.trace");

    @AroundInvoke
    public Object trace(InvocationContext ctx) throws Exception {
        String method = ctx.getMethod().getDeclaringClass().getSimpleName() + "." + ctx.getMethod().getName();
        String args = LogRedactor.safeArgs(ctx.getMethod().getParameters(), ctx.getParameters());

        LOG.debugf("-> %s(%s)", method, args);
        long startNanos = System.nanoTime();
        try {
            Object result = ctx.proceed();
            long tookMs = (System.nanoTime() - startNanos) / 1_000_000;
            LOG.debugf("<- %s took %dms, returned %s", method, tookMs, LogRedactor.safeResult(result));
            if (tookMs > SLOW_THRESHOLD_MS) {
                LOG.warnf("SLOW %s took %dms (threshold %dms)", method, tookMs, SLOW_THRESHOLD_MS);
            }
            return result;
        } catch (Exception e) {
            long tookMs = (System.nanoTime() - startNanos) / 1_000_000;
            LOG.errorf(e, "x  %s failed after %dms: %s", method, tookMs, e.getMessage());
            throw e;
        }
    }
}
