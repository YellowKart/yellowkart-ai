package com.yellowkart.ai.logging;

import jakarta.interceptor.InterceptorBinding;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks a class (every business method on it) or a single method for
 * automatic entry/exit/timing logging via TracingInterceptor. Applied at the
 * class level on controllers and service impls so every method gets traced
 * without hand-editing each one -- see the interceptor for what actually
 * gets logged and how sensitive values are redacted.
 */
@Inherited
@InterceptorBinding
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Traced {
}
