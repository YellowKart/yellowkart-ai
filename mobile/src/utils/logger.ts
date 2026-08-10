type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogMeta = Record<string, unknown>;

const SENSITIVE_KEYS = new Set([
  'password',
  'passwd',
  'pwd',
  'otp',
  'pin',
  'token',
  'accesstoken',
  'refreshtoken',
  'idtoken',
  'authorization',
  'auth',
  'clientsecret',
  'secret',
  'apikey',
  'xapikey',
  'cookie',
  'setcookie',
  'session',
  'sessionid',
  'jwt',
  'bearer',
  'cardnumber',
  'cvv',
  'cvc',
  'pan',
  'aadhaar',
  'aadhar',
  'ssn',
  'accountnumber',
  'ifsc',
  'upi',
  'vpa',
  'razorpaykey',
  'razorpaysecret',
  'authtoken',
]);

const BEARER_PATTERN = /(bearer\s+)[a-z0-9\-._]+/gi;
const OTP_PATTERN = /(\botp\b\s*[:=]\s*)\d{4,8}/gi;
const LONG_DIGIT_PATTERN = /\b\d{12,19}\b/g;

export const REDACTED = '[REDACTED]';

function isDevMode(): boolean {
  try {
    // Expo / React Native
    // eslint-disable-next-line no-undef
    if (typeof __DEV__ !== 'undefined') {
      // eslint-disable-next-line no-undef
      return Boolean(__DEV__);
    }
  } catch {
    // ignore
  }
  return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[-_]/g, '');
}

export function isSensitiveKey(key: string | null | undefined): boolean {
  if (!key) return false;
  const normalized = normalizeKey(key);
  if (SENSITIVE_KEYS.has(normalized)) return true;
  for (const sensitive of SENSITIVE_KEYS) {
    if (normalized.includes(sensitive) && sensitive.length >= 3) {
      // Avoid over-matching short tokens like "pan" inside unrelated words.
      if (sensitive.length <= 3) {
        if (normalized === sensitive) return true;
        continue;
      }
      return true;
    }
  }
  return false;
}

export function sanitizeText(input: string): string {
  return input
    .replace(BEARER_PATTERN, `$1${REDACTED}`)
    .replace(OTP_PATTERN, `$1${REDACTED}`)
    .replace(LONG_DIGIT_PATTERN, REDACTED);
}

export function sanitize(value: unknown, key?: string): unknown {
  if (value == null) return value;
  if (key && isSensitiveKey(key)) return REDACTED;

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item));
  }

  if (typeof value === 'object') {
    const out: LogMeta = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitize(v, k);
    }
    return out;
  }

  if (typeof value === 'string') {
    return sanitizeText(value);
  }

  return value;
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, 'http://local');
    const path = parsed.pathname;
    const params = new URLSearchParams(parsed.search);
    const parts: string[] = [];
    params.forEach((value, key) => {
      const safeValue = isSensitiveKey(key) ? REDACTED : sanitizeText(value);
      parts.push(`${encodeURIComponent(key)}=${safeValue}`);
    });
    const qs = parts.join('&');
    const isAbsolute = /^https?:\/\//i.test(url);
    if (isAbsolute) {
      return `${parsed.origin}${path}${qs ? `?${qs}` : ''}`;
    }
    return `${path}${qs ? `?${qs}` : ''}`;
  } catch {
    return sanitizeText(url);
  }
}

function emit(level: LogLevel, scope: string, message: string, meta?: LogMeta) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    scope,
    message,
    ...(meta ? { meta: sanitize(meta) as LogMeta } : {}),
  };

  const line = JSON.stringify(payload);
  switch (level) {
    case 'debug':
      if (isDevMode()) console.debug(line);
      break;
    case 'info':
      console.info(line);
      break;
    case 'warn':
      console.warn(line);
      break;
    case 'error':
      console.error(line);
      break;
  }
}

export type FlowHandle = {
  flowId: string;
  step: (stepName: string, meta?: LogMeta) => void;
  success: (meta?: LogMeta) => void;
  failure: (error: unknown, meta?: LogMeta) => void;
  time: <T>(operation: string, fn: () => Promise<T> | T, meta?: LogMeta) => Promise<T>;
};

function errorMeta(error: unknown): LogMeta {
  if (error instanceof Error) {
    return {
      errorType: error.name,
      errorMessage: sanitizeText(error.message),
    };
  }
  return { errorMessage: sanitizeText(String(error)) };
}

export function createLogger(scope: string) {
  return {
    debug(message: string, meta?: LogMeta) {
      emit('debug', scope, message, meta);
    },
    info(message: string, meta?: LogMeta) {
      emit('info', scope, message, meta);
    },
    warn(message: string, meta?: LogMeta) {
      emit('warn', scope, message, meta);
    },
    error(message: string, meta?: LogMeta) {
      emit('error', scope, message, meta);
    },
    startFlow(flowName: string, meta?: LogMeta): FlowHandle {
      const flowId = `${flowName}-${Math.random().toString(36).slice(2, 10)}`;
      const startedAt = Date.now();
      emit('info', scope, 'FLOW_START', { flowName, flowId, ...(meta || {}) });

      return {
        flowId,
        step(stepName, stepMeta) {
          emit('info', scope, 'FLOW_STEP', {
            flowName,
            flowId,
            step: stepName,
            elapsedMs: Date.now() - startedAt,
            ...(stepMeta || {}),
          });
        },
        success(endMeta) {
          emit('info', scope, 'FLOW_END', {
            flowName,
            flowId,
            status: 'success',
            durationMs: Date.now() - startedAt,
            ...(endMeta || {}),
          });
        },
        failure(error, endMeta) {
          emit('error', scope, 'FLOW_END', {
            flowName,
            flowId,
            status: 'failure',
            durationMs: Date.now() - startedAt,
            ...errorMeta(error),
            ...(endMeta || {}),
          });
        },
        async time(operation, fn, opMeta) {
          const opStart = Date.now();
          emit('info', scope, 'OP_START', { flowName, flowId, op: operation, ...(opMeta || {}) });
          try {
            const result = await fn();
            emit('info', scope, 'OP_END', {
              flowName,
              flowId,
              op: operation,
              status: 'success',
              durationMs: Date.now() - opStart,
            });
            return result;
          } catch (error) {
            emit('error', scope, 'OP_END', {
              flowName,
              flowId,
              op: operation,
              status: 'failure',
              durationMs: Date.now() - opStart,
              ...errorMeta(error),
            });
            throw error;
          }
        },
      };
    },
    async timeOperation<T>(operation: string, fn: () => Promise<T> | T, meta?: LogMeta): Promise<T> {
      const opStart = Date.now();
      emit('info', scope, 'OP_START', { op: operation, ...(meta || {}) });
      try {
        const result = await fn();
        emit('info', scope, 'OP_END', {
          op: operation,
          status: 'success',
          durationMs: Date.now() - opStart,
        });
        return result;
      } catch (error) {
        emit('error', scope, 'OP_END', {
          op: operation,
          status: 'failure',
          durationMs: Date.now() - opStart,
          ...errorMeta(error),
        });
        throw error;
      }
    },
  };
}

export type Logger = ReturnType<typeof createLogger>;
