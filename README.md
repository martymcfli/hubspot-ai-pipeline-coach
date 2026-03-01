# HubSpot AI Pipeline Coach

An AI-powered deal coaching tool that analyzes your HubSpot pipeline and gives reps real-time guidance on how to move deals forward — with live competitor intelligence, deal health scoring, and voice input.

## What It Does

- **Deal Analysis** — paste in deal data and get an AI breakdown of risk factors, next best actions, and close probability
- **Competitor Intelligence** — live web search surfaces recent news and positioning intel on competitors in the deal
- **Pipeline Health Dashboard** — visualizes deal stage distribution, velocity, and risk concentration
- **Voice Input** — speak your deal context instead of typing it
- **AI Chat** — ask follow-up questions about any deal or coaching recommendation

## Tech Stack

- React 18 + TypeScript
- Vite
- Gemini API (Google AI)
- Framer Motion
- Recharts
- Lucide React

## Run Locally

```bash
# 1. Clone
git clone https://github.com/martymcfli/hubspot-ai-pipeline-coach.git
cd hubspot-ai-pipeline-coach

# 2. Install
npm install

# 3. Add your Gemini API key
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY=your_key

# 4. Start
npm run dev
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/app/apikey).

## Features

| Feature | Description |
|---------|-------------|
| Deal Scoring | AI-assessed close probability with risk flags |
| Competitor Intel | Live search for recent competitor news relevant to the deal |
| Voice Input | Browser-based speech recognition for hands-free deal entry |
| Pipeline View | Stage-by-stage bar chart with deal volume and value |
| AI Chat | Contextual follow-up coaching on any deal |

---

Built by [Owen McCormick](https://omccormick.com)
