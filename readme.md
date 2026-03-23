# GitHub Readme Stats — Next.js 15 Migration

Migrated from Express.js to **Next.js 15** with **TypeScript** and **Tailwind CSS v4**.

## Stack

| | Before | After |
|---|---|---|
| Framework | Express.js | Next.js 15 (App Router) |
| Language | JavaScript | TypeScript + JavaScript (allowJs) |
| Styles | Inline HTML | Tailwind CSS v4 |
| Deployment | Vercel serverless functions | Next.js Route Handlers |
| Config | `dotenv` | `.env.local` (built-in) |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local and add: PAT_1=ghp_your_github_token

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000/url-builder](http://localhost:3000/url-builder)

## API Endpoints

All endpoints return `image/svg+xml` unless noted.

| Endpoint | Description |
|---|---|
| `GET /api?username=x` | GitHub Stats Card |
| `GET /api/pin?username=x&repo=y` | Repository Pin Card |
| `GET /api/top-langs?username=x` | Top Languages Card |
| `GET /api/streak?username=x` | Activity Streak Card |
| `GET /api/wakatime?username=x` | WakaTime Stats Card |
| `GET /api/gist?id=x` | GitHub Gist Card |
| `GET /api/status/up` | Health check (JSON) |
| `GET /api/status/pat-info` | PAT status (JSON) |

## Environment Variables

```env
# Required: at least one GitHub Personal Access Token
PAT_1=ghp_xxxxxxxxxxxx

# Optional
CACHE_SECONDS=86400        # Override cache duration
WHITELIST=user1,user2      # Restrict to these usernames
GIST_WHITELIST=id1,id2     # Restrict to these gist IDs
EXCLUDE_REPO=repo1,repo2   # Exclude from stats
FETCH_MULTI_PAGE_STARS=false
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
# Set environment variables in Vercel dashboard
```

## Architecture

```
app/
├── url-builder/page.tsx    ← Interactive URL builder (React, Tailwind)
└── api/
    ├── route.ts            ← /api  (stats card)
    ├── pin/route.ts        ← /api/pin
    ├── top-langs/route.ts  ← /api/top-langs
    ├── streak/route.ts     ← /api/streak
    ├── wakatime/route.ts   ← /api/wakatime
    ├── gist/route.ts       ← /api/gist
    └── status/
        ├── up/route.ts
        └── pat-info/route.ts

src/
├── cards/         ← SVG card renderers (JS, unchanged logic)
├── common/        ← Shared utilities
├── fetchers/      ← GitHub / WakaTime API clients
├── calculateRank.js
└── translations.js

themes/index.js    ← Built-in themes
```

## Running Tests

```bash
npm test
```

> Tests use Jest with jsdom. The existing test suite from the original project works
> with minor path adjustments since `allowJs: true` is set in tsconfig.
