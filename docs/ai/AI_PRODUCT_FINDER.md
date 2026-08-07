# YellowKart AI Product Finder (OpenAI-first)

Buyer-facing feature in the **real YellowKart buyer app** (web + mobile): suggest
construction products from **image / camera**, **multilingual voice**, or **text**,
and map **handwritten requirements lists** (any Indian language) to catalog products.

The separate demo AI web app (`yellowkart-ai-web`) has been removed. Use the buyer app only.

## Requirements list (handwritten)

| Client | Entry |
|--------|-------|
| Web | `/requirements` — upload photo, review matches, fill qty, submit bulk order |
| Mobile | Requirements tab — camera/gallery (or image URI), apply matches, submit |

API: `POST /api/ai/suggest/list-image` (multipart `file`, optional `hint`)

## Live deployment

| Service | URL |
|---------|-----|
| AI API | https://yellowkart-ai-service.onrender.com |
| Buyer web (AI Finder) | https://yellowkart-web.onrender.com/ai-finder |

Health: `GET https://yellowkart-ai-service.onrender.com/api/ai/health`

This repo hosts the **AI API** (`backend/ai-service`). The buyer UI lives in the
[YellowKart/YellowKart](https://github.com/YellowKart/YellowKart) repository.

## Mode

**OpenAI-first (option B)**

| Input | Provider | Purpose |
|-------|----------|---------|
| Image / camera | **OpenAI Vision** (`gpt-4o-mini`) | Detect materials & site needs |
| Voice audio | **OpenAI Whisper** (`whisper-1`, auto language) | Speech → transcript + language |
| Text / transcript | **GPT** multilingual interpret | Intent + **reply in buyer’s language** |
| Ranking | Construction matcher + Indian lexicon | Rank products (most specific first) |

## Indian languages & slang

Voice and text support **automatic language detection** and **localized replies**, including:

- Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu
- Code-mixing / slang: Hinglish, Tanglish, Tenglish, etc. (e.g. `mujhe cement chahiye`, `TMT rod vena`, `bathroom leak aaguthu`)

**Flow**

1. Buyer records audio (preferred) or types/pastes text / uploads a photo  
2. Whisper / Vision / GPT interpret materials and reply in the **same language**  
3. Matcher expands vernacular terms and ranks specific matches first (e.g. elbow before generic pipe)  
4. Buyer app maps suggestions to live YellowKart catalog products → **Add to cart** / view details  

If `OPENAI_API_KEY` is unset, stub mode still expands many Indian terms and returns localized template replies.

## Architecture

```
YellowKart buyer web  (/ai-finder)  ──┐
YellowKart buyer mobile (AI tab)   ──┼─►  yellowkart-ai-service
                                     │      Vision / Whisper / Chat
                                     │      Indian lexicon + matcher
                                     └─►  construction product suggestions
                                          (mapped to live catalog in buyer app)
```

## Buyer app entry points (YellowKart/YellowKart)

| Platform | Where |
|----------|--------|
| **Web** | Header **AI Finder**, Home CTA → `/ai-finder` |
| **Mobile** | Footer **AI** tab, Home banner, Browse drawer, Profile |

## Run AI API locally

```bash
export OPENAI_API_KEY=sk-...   # required for real Vision/Whisper/multilingual reply
cd backend/ai-service
mvn quarkus:dev
```

```bash
curl http://localhost:8007/api/ai/health
```

## Example calls

**Hindi text**

```bash
curl -s -X POST https://yellowkart-ai-service.onrender.com/api/ai/suggest/text \
  -H 'Content-Type: application/json' \
  -d '{"query":"मुझे सीमेंट चाहिए","limit":5}'
```

**English / slang**

```bash
curl -s -X POST https://yellowkart-ai-service.onrender.com/api/ai/suggest/text \
  -H 'Content-Type: application/json' \
  -d '{"query":"pvc elbow","limit":5}'
```
