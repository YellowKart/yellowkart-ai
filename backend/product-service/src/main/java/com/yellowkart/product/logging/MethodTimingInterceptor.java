package com.yellowkart.product.logging;

import jakarta.annotation.Priority;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import org.jboss.logging.Logger;

import java.lang.reflect.Parameter;
import java.util.LinkedHashMap;
import java.util.Map;

@Logged
@Priority(Interceptor.Priority.APPLICATION + 10)
@Interceptor
public class MethodTimingInterceptor {

    private static final Logger LOG = Logger.getLogger(MethodTimingInterceptor.class);

    @AroundInvoke
    public Object around(InvocationContext context) throws Exception {
        String className = context.getTarget() == null
                ? context.getMethod().getDeclaringClass().getSimpleName()
                : context.getTarget().getClass().getSimpleName();
        int proxyIdx = className.indexOf('_');
        if (proxyIdx > 0) {
            className = className.substring(0, proxyIdx);
        }
        String methodName = context.getMethod().getName();
        String op = className + "." + methodName;
        long started = System.nanoTime();
        Map<String, Object> args = sanitizeArgs(context);
        LOG.info("METHOD_START op=" + op + " args=" + args);
        try {
            Object result = context.proceed();
            LOG.info("METHOD_END op=" + op
                    + " status=success"
                    + " durationMs=" + ((System.nanoTime() - started) / 1_000_000L)
                    + " resultType=" + (result == null ? "null" : result.getClass().getSimpleName()));
            return result;
        } catch (Exception ex) {
            LOG.error("METHOD_END op=" + op
                    + " status=failure"
                    + " durationMs=" + ((System.nanoTime() - started) / 1_000_000L)
                    + " errorType=" + ex.getClass().getSimpleName()
                    + " errorMessage=" + LogSanitizer.sanitizeText(String.valueOf(ex.getMessage())));
            throw ex;
        }
    }

    private static Map<String, Object> sanitizeArgs(InvocationContext context) {
        Map<String, Object> out = new LinkedHashMap<>();
        Parameter[] parameters = context.getMethod().getParameters();
        Object[] values = context.getParameters();
        if (parameters == null || values == null) {
            return out;
        }
        int n = Math.min(parameters.length, values.length);
        for (int i = 0; i < n; i++) {
            String name = parameters[i].getName();
            if (name == null || name.isBlank() || name.startsWith("arg")) {
                name = "arg" + i;
            }
            Object value = values[i];
            if (value == null) {
                out.put(name, null);
            } else if (LogSanitizer.isSensitiveKey(name)) {
                out.put(name, LogSanitizer.REDACTED);
            } else if (value instanceof byte[]) {
                out.put(name, "byte[" + ((byte[]) value).length + "]");
            } else if (value instanceof CharSequence || value instanceof Number || value instanceof Boolean) {
                out.put(name, LogSanitizer.sanitizeValue(name, value));
            } else if (value.getClass().isEnum()) {
                out.put(name, value.toString());
            } else {
                out.put(name, value.getClass().getSimpleName());
            }
        }
        return out;
    }
}
