package com.yellowkart.user.logging;

import org.jboss.logging.Logger;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * Nested method/block tracer. Safe for sensitive data: only names and durations are logged.
 */
public final class YkTrace {

    private static final Logger LOG = Logger.getLogger("yk.trace");
    private static final ThreadLocal<Deque<Frame>> STACK = ThreadLocal.withInitial(ArrayDeque::new);

    private YkTrace() {
    }

    public static Scope method(String className, String methodName) {
        return open("METHOD", className + "." + methodName);
    }

    public static Scope block(String className, String methodName, String blockName) {
        return open("BLOCK", className + "." + methodName + "#" + blockName);
    }

    private static Scope open(String kind, String name) {
        long start = System.nanoTime();
        Deque<Frame> stack = STACK.get();
        int depth = stack.size();
        stack.push(new Frame(kind, name, start));
        LOG.info(kind + "_START op=" + name + " depth=" + depth);
        return () -> {
            Frame frame = stack.poll();
            long durationMs = frame == null ? -1L : (System.nanoTime() - frame.startNanos) / 1_000_000L;
            LOG.info(kind + "_END op=" + name + " depth=" + depth + " durationMs=" + durationMs);
        };
    }

    @FunctionalInterface
    public interface Scope extends AutoCloseable {
        @Override
        void close();
    }

    private static final class Frame {
        private final String kind;
        private final String name;
        private final long startNanos;

        private Frame(String kind, String name, long startNanos) {
            this.kind = kind;
            this.name = name;
            this.startNanos = startNanos;
        }
    }
}
