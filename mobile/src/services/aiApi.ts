import { API } from '../config';

export type ProductSuggestion = {
  id: number;
  name: string;
  brand?: string;
  confidence?: number;
};

export type ListLineSuggestion = {
  rawText: string;
  quantity?: number | null;
  unit?: string;
  brandHint?: string;
  suggestions: ProductSuggestion[];
};

export type ListSuggestResponse = {
  replyMessage?: string;
  detectedLanguageName?: string;
  lines: ListLineSuggestion[];
};

export async function suggestFromListImage(
  uri: string,
  hint?: string,
  fileName = 'handwritten-list.jpg'
): Promise<ListSuggestResponse> {
  const form = new FormData();
  form.append('file', {
    uri,
    type: 'image/jpeg',
    name: fileName,
  } as any);
  if (hint) {
    form.append('hint', hint);
  }
  form.append('limit', '5');

  const response = await fetch(`${API.ai}/suggest/list-image`, {
    method: 'POST',
    body: form,
    headers: {
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to analyze handwritten list');
  }
  return response.json();
}
