import { createLogger } from '../utils/logger';
const __ykLog = createLogger("aiApi");
export type ProductSuggestion = {
  id: number;
  name: string;
  brand?: string;
  price?: number;
  category?: string;
  confidence?: number;
  reason?: string;
};
export type ListLineSuggestion = {
  rawText: string;
  quantity?: number | null;
  unit?: string;
  brandHint?: string;
  queryText?: string;
  detectedLanguage?: string;
  suggestions: ProductSuggestion[];
};
export type ListSuggestResponse = {
  inputType: string;
  replyMessage?: string;
  detectedLanguage?: string;
  detectedLanguageName?: string;
  analysisSummary?: string;
  usedExternalAi?: boolean;
  lines: ListLineSuggestion[];
};
const log = createLogger('web.aiApi');
const AI_API = 'http://localhost:8007/api/ai';
export async function suggestFromListImage(file: File | Blob, hint?: string, fileName = 'handwritten-list.jpg'): Promise<ListSuggestResponse> {
  const __ykStart = Date.now();
  const __ykOp = "aiApi.suggestFromListImage";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    return log.timeOperation('suggestFromListImage', async () => {
      const __ykStart = Date.now();
      const __ykOp = "aiApi.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        const form = new FormData();
        form.append('file', file, fileName);
        if (hint) {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "aiApi#if1"
          });
          try {
            form.append('hint', hint);
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "aiApi#if1",
              durationMs: Date.now() - __ykBlockStart1
            });
          }
        }
        form.append('limit', '5');
        const response = await fetch(`${AI_API}/suggest/list-image`, {
          method: 'POST',
          body: form
        });
        if (!response.ok) {
          const __ykBlockStart2 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "aiApi#if2"
          });
          try {
            const text = await response.text();
            throw new Error(text || 'Failed to analyze handwritten list');
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "aiApi#if2",
              durationMs: Date.now() - __ykBlockStart2
            });
          }
        }
        return response.json();
      } catch (__ykErr) {
        __ykOk = false;
        __ykLog.error("METHOD_END", {
          op: __ykOp,
          status: "failure",
          durationMs: Date.now() - __ykStart
        });
        throw __ykErr;
      } finally {
        if (__ykOk) __ykLog.info("METHOD_END", {
          op: __ykOp,
          status: "success",
          durationMs: Date.now() - __ykStart
        });
      }
    });
  } catch (__ykErr) {
    __ykOk = false;
    __ykLog.error("METHOD_END", {
      op: __ykOp,
      status: "failure",
      durationMs: Date.now() - __ykStart
    });
    throw __ykErr;
  } finally {
    if (__ykOk) __ykLog.info("METHOD_END", {
      op: __ykOp,
      status: "success",
      durationMs: Date.now() - __ykStart
    });
  }
}