export type ProductSuggestion = {
  id: number
  name: string
  brand?: string
  price?: number
  category?: string
  confidence?: number
  reason?: string
}

export type ListLineSuggestion = {
  rawText: string
  quantity?: number | null
  unit?: string
  brandHint?: string
  queryText?: string
  detectedLanguage?: string
  suggestions: ProductSuggestion[]
}

export type ListSuggestResponse = {
  inputType: string
  replyMessage?: string
  detectedLanguage?: string
  detectedLanguageName?: string
  analysisSummary?: string
  usedExternalAi?: boolean
  lines: ListLineSuggestion[]
}

const AI_API = 'http://localhost:8007/api/ai'

export async function suggestFromListImage(
  file: File | Blob,
  hint?: string,
  fileName = 'handwritten-list.jpg'
): Promise<ListSuggestResponse> {
  const form = new FormData()
  form.append('file', file, fileName)
  if (hint) {
    form.append('hint', hint)
  }
  form.append('limit', '5')

  const response = await fetch(`${AI_API}/suggest/list-image`, {
    method: 'POST',
    body: form,
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Failed to analyze handwritten list')
  }
  return response.json()
}
