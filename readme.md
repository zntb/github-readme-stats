<div align="center">
  <img src="https://res.cloudinary.com/anuraghazra/image/upload/v1594908242/logo_ccswme.svg" width="100px" alt="GitHub Readme Stats" />
  <h1>GitHub Readme Stats</h1>
  <p>Dynamically generate GitHub stats cards for your READMEs</p>
</div>

<p align="center">
  <a href="https://github.com/anuraghazra/github-readme-stats/actions">
    <img alt="Tests Passing" src="https://github.com/anuraghazra/github-readme-stats/workflows/Test/badge.svg" />
  </a>
  <a href="https://github.com/anuraghazra/github-readme-stats/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/anuraghazra/github-readme-stats?color=0088ff" />
  </a>
  <a href="https://github.com/anuraghazra/github-readme-stats/pulls">
    <img alt="Pull Requests" src="https://img.shields.io/github/issues-pr/anuraghazra/github-readme-stats?color=0088ff" />
  </a>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-interactive-url-builder">URL Builder</a> ·
  <a href="#-github-stats-card">Stats Card</a> ·
  <a href="#-repo-pin-card">Repo Pin</a> ·
  <a href="#-top-languages-card">Top Languages</a> ·
  <a href="#-activity-streak-card">Streak</a> ·
  <a href="#-wakatime-card">WakaTime</a> ·
  <a href="#-gist-card">Gist</a> ·
  <a href="#-themes">Themes</a> ·
  <a href="#-deploy-your-own">Deploy</a>
</p>

---

> **Now running on Next.js 15 + TypeScript + Tailwind CSS v4.**
> All card endpoints and query parameters are fully backward-compatible.

---

## Table of Contents

- [Quick Start](#-quick-start)
- [Interactive URL Builder](#-interactive-url-builder)
- [GitHub Stats Card](#-github-stats-card)
- [Repo Pin Card](#-repo-pin-card)
- [Gist Card](#-gist-card)
- [Top Languages Card](#-top-languages-card)
- [WakaTime Card](#-wakatime-card)
- [Activity Streak Card](#-activity-streak-card)
- [Themes](#-themes)
- [Common Options](#%EF%B8%8F-common-options)
- [Deploy Your Own](#-deploy-your-own)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)

---

## ⚡ Quick Start

Copy a snippet below, swap `anuraghazra` for your GitHub username, and paste it into any README.

```md
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=anuraghazra&show_icons=true)
```

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=anuraghazra&show_icons=true)

> [!IMPORTANT]
> The public instance at `https://github-readme-stats.vercel.app` is best-effort and may be rate-limited during traffic spikes. For guaranteed uptime, [deploy your own instance](#-deploy-your-own).

---

## 🛠 Interactive URL Builder

The easiest way to build a custom card URL — choose your card type, pick a theme, adjust colors, and get a live preview with a ready-to-paste Markdown snippet.

```
https://github-readme-stats.vercel.app/url-builder
```

**Features:**
- Live card preview that updates as you type
- Supports all six card types (Stats, Pin, Top Languages, Streak, WakaTime, Gist)
- 30+ built-in themes in a dropdown
- Color pickers with hex input for full customization
- Advanced options: border radius, card width, locale, cache TTL, animations
- One-click copy of the generated URL and Markdown snippet

---

## 📊 GitHub Stats Card

Shows stars, commits, PRs, issues, reviews, and contributions for any GitHub user.

**Endpoint:** `GET /api`

```md
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=anuraghazra)
```

### Hiding individual stats

Use `&hide=` with a comma-separated list to remove specific stats.

> Options: `stars`, `commits`, `prs`, `issues`, `contribs`

```md
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=anuraghazra&hide=contribs,prs)
```

### Showing additional stats

Use `&show=` to display stats that are hidden by default.

> Options: `reviews`, `discussions_started`, `discussions_answered`, `prs_merged`, `prs_merged_percentage`

```md
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=anuraghazra&show=reviews,prs_merged,prs_merged_percentage)
```

### Stats Card exclusive options

| Parameter | Description | Type | Default |
|---|---|---|---|
| `username` | GitHub username (**required**) | string | — |
| `hide` | Comma-separated stats to hide | string | `null` |
| `show` | Additional stats to show | string | `null` |
| `show_icons` | Show icons beside each stat | boolean | `false` |
| `hide_title` | Hide the card title | boolean | `false` |
| `hide_rank` | Hide the rank circle | boolean | `false` |
| `rank_icon` | Rank icon style: `default`, `github`, `percentile` | enum | `default` |
| `card_width` | Card width in pixels | number | `450` |
| `line_height` | Spacing between stat rows | number | `25` |
| `include_all_commits` | Count all-time commits instead of current year | boolean | `false` |
| `commits_year` | Count commits for a specific year (e.g. `2023`) | number | current year |
| `number_format` | `short` (6.6k) or `long` (6626) | enum | `short` |
| `number_precision` | Decimal places for `short` format (0–2) | number | `null` |
| `ring_color` | Color of the rank ring | hex | `title_color` |
| `text_bold` | Bold stat labels | boolean | `true` |
| `custom_title` | Override the card title | string | `<username>'s GitHub Stats` |
| `disable_animations` | Disable all SVG animations | boolean | `false` |
| `exclude_repo` | Repos to exclude from star count | string (CSV) | `null` |

---

## 📌 Repo Pin Card

Embed a repository card anywhere — useful for pinning more than GitHub's six-repo limit.

**Endpoint:** `GET /api/pin`

```md
[![Repo Card](https://github-readme-stats.vercel.app/api/pin/?username=anuraghazra&repo=github-readme-stats)](https://github.com/anuraghazra/github-readme-stats)
```

### Repo Pin exclusive options

| Parameter | Description | Type | Default |
|---|---|---|---|
| `username` | Repository owner (**required**) | string | — |
| `repo` | Repository name (**required**) | string | — |
| `show_owner` | Show the owner's username in the title | boolean | `false` |
| `description_lines_count` | Force description line count (1–3) | number | auto |

---

## 📝 Gist Card

Display any public GitHub Gist as a card.

**Endpoint:** `GET /api/gist`

```md
[![Gist Card](https://github-readme-stats.vercel.app/api/gist?id=bbfce31e0217a3689c8d961a356cb10d)](https://gist.github.com/Yizack/bbfce31e0217a3689c8d961a356cb10d/)
```

### Gist exclusive options

| Parameter | Description | Type | Default |
|---|---|---|---|
| `id` | Gist ID (**required**) | string | — |
| `show_owner` | Show the gist owner's username | boolean | `false` |

---

## 🌐 Top Languages Card

Shows the programming languages used most across your public repositories, measured by code volume.

**Endpoint:** `GET /api/top-langs`

```md
[![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=anuraghazra)](https://github.com/anuraghazra/github-readme-stats)
```

> [!NOTE]
> Top Languages reflects code volume in your own non-forked public repositories, not expertise or time spent.

### Layout options

| Layout | Parameter value |
|---|---|
| Normal (default) | `normal` |
| Compact | `compact` |
| Donut chart | `donut` |
| Donut vertical | `donut-vertical` |
| Pie chart | `pie` |

```md
![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=anuraghazra&layout=compact)
```

### Ranking algorithm

```
ranking_index = (byte_count ^ size_weight) * (repo_count ^ count_weight)
```

Defaults to byte count only. Use both weights for a more balanced view:

```md
![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=anuraghazra&size_weight=0.5&count_weight=0.5)
```

### Top Languages exclusive options

| Parameter | Description | Type | Default |
|---|---|---|---|
| `username` | GitHub username (**required**) | string | — |
| `layout` | Card layout style | enum | `normal` |
| `langs_count` | Number of languages to show (1–20) | number | `5`/`6` by layout |
| `hide` | Languages to exclude | string (CSV) | `null` |
| `exclude_repo` | Repos to exclude | string (CSV) | `null` |
| `size_weight` | Weight for byte count in ranking | number | `1` |
| `count_weight` | Weight for repo count in ranking | number | `0` |
| `hide_progress` | Hide progress bars and percentages | boolean | `false` |
| `stats_format` | `percentages` or `bytes` | enum | `percentages` |
| `card_width` | Card width in pixels | number | `300` |
| `custom_title` | Override the card title | string | `Most Used Languages` |
| `disable_animations` | Disable all SVG animations | boolean | `false` |

---

## ⏱ WakaTime Card

Shows your weekly coding activity from [WakaTime](https://wakatime.com).

**Endpoint:** `GET /api/wakatime`

```md
[![WakaTime Stats](https://github-readme-stats.vercel.app/api/wakatime?username=ffflabs)](https://github.com/anuraghazra/github-readme-stats)
```

> [!WARNING]
> Your WakaTime profile must have both **Display code time publicly** and **Display languages, editors, os, categories publicly** enabled. Stats may take up to 24 hours to appear after account creation.

### WakaTime exclusive options

| Parameter | Description | Type | Default |
|---|---|---|---|
| `username` | WakaTime username (**required**) | string | — |
| `layout` | Card layout: `normal` or `compact` | enum | `normal` |
| `langs_count` | Number of languages to display | number | all |
| `hide` | Languages to exclude | string (CSV) | `null` |
| `api_domain` | Custom compatible API domain (e.g. [Wakapi](https://github.com/muety/wakapi), [Hakatime](https://github.com/mujx/hakatime)) | string | `wakatime.com` |
| `display_format` | Show `time` (22 hrs) or `percent` (48.2%) | enum | `time` |
| `hide_progress` | Hide progress bars | boolean | `false` |
| `card_width` | Card width in pixels | number | `495` |
| `line_height` | Spacing between language rows | number | `25` |
| `custom_title` | Override the card title | string | `WakaTime Stats` |
| `disable_animations` | Disable all SVG animations | boolean | `false` |

---

## 🔥 Activity Streak Card

Displays your current contribution streak, longest streak, and total days contributed.

**Endpoint:** `GET /api/streak`

```md
[![Streak](https://github-readme-stats.vercel.app/api/streak?username=anuraghazra)](https://github.com/anuraghazra/github-readme-stats)
```

### Streak exclusive options

| Parameter | Description | Type | Default |
|---|---|---|---|
| `username` | GitHub username (**required**) | string | — |
| `hide_title` | Hide the card title | boolean | `false` |
| `hide_border` | Hide the card border | boolean | `false` |
| `custom_title` | Override the card title | string | `Activity Streak` |

---

## 🎨 Themes

Apply a theme with `&theme=THEME_NAME`. Themes affect title color, icon color, text color, and background.

```md
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=anuraghazra&theme=radical)
```

### Available Themes

| Theme | Style |
|---|---|
| `default` | Light, blue title |
| `dark` | Dark bg, green icons |
| `radical` | Pink title, yellow icons, dark purple bg |
| `merko` | Green tones, dark bg |
| `gruvbox` | Warm amber/orange, dark bg |
| `gruvbox_light` | Warm tones, light bg |
| `tokyonight` | Blue/purple, dark navy bg |
| `onedark` | Amber title, dark bg |
| `cobalt` | Purple/cyan, deep blue bg |
| `synthwave` | Neon pink/orange, dark purple bg |
| `highcontrast` | Yellow/cyan, black bg |
| `dracula` | Pink/cyan, dark grey bg |
| `prussian` | Blue tones, navy bg |
| `monokai` | Pink/orange, dark green bg |
| `vue` | Vue green on white |
| `nightowl` | Purple/yellow, dark teal bg |
| `nord` | Blue-grey Nord palette |
| `github_dark` | GitHub dark mode |
| `github_dark_dimmed` | GitHub dimmed dark mode |
| `aura` | Purple/teal, very dark bg |
| `catppuccin_latte` | Catppuccin light |
| `catppuccin_mocha` | Catppuccin dark |
| `ambient_gradient` | Animated gradient background |
| `transparent` | Transparent background |

### Responsive themes (dark/light mode)

Switch automatically based on the viewer's GitHub theme using theme context tags:

```md
[![Stats Dark](https://github-readme-stats.vercel.app/api?username=anuraghazra&theme=dark#gh-dark-mode-only)](https://github.com/anuraghazra/github-readme-stats#gh-dark-mode-only)
[![Stats Light](https://github-readme-stats.vercel.app/api?username=anuraghazra&theme=default#gh-light-mode-only)](https://github.com/anuraghazra/github-readme-stats#gh-light-mode-only)
```

Or use the HTML `<picture>` element for finer control:

```html
<picture>
  <source
    srcset="https://github-readme-stats.vercel.app/api?username=anuraghazra&theme=dark"
    media="(prefers-color-scheme: dark)"
  />
  <source
    srcset="https://github-readme-stats.vercel.app/api?username=anuraghazra"
    media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
  />
  <img src="https://github-readme-stats.vercel.app/api?username=anuraghazra" />
</picture>
```

---

## ⚙️ Common Options

These parameters work on **every card type**.

| Parameter | Description | Type | Default |
|---|---|---|---|
| `title_color` | Card title color | hex | `2f80ed` |
| `text_color` | Body text color | hex | `434d58` |
| `icon_color` | Icon color | hex | `4c71f2` |
| `border_color` | Border color | hex | `e4e2e2` |
| `bg_color` | Background color or gradient | hex / gradient | `fffefe` |
| `theme` | Built-in theme name | enum | `default` |
| `hide_border` | Remove the card border | boolean | `false` |
| `border_radius` | Corner rounding in pixels | number | `4.5` |
| `locale` | Card label language | enum | `en` |
| `cache_seconds` | Cache TTL in seconds | number | varies |

### Gradient backgrounds

Provide a rotation angle followed by two or more hex colors, all comma-separated:

```
&bg_color=30,e96443,904e95
```

### Locales

`ar` · `az` · `bn` · `bg` · `my` · `ca` · `cn` · `zh-tw` · `cs` · `nl` · `en` · `fil` · `fi` · `fr` · `de` · `el` · `he` · `hi` · `hu` · `id` · `it` · `ja` · `kr` · `ml` · `np` · `no` · `fa` · `pl` · `pt-br` · `pt-pt` · `ro` · `ru` · `sa` · `sr` · `sk` · `es` · `sw` · `se` · `ta` · `th` · `tr` · `uk-ua` · `ur` · `uz` · `vi`

### Default cache durations

| Card | Default TTL | Min | Max |
|---|---|---|---|
| Stats | 24 h | 12 h | 48 h |
| Top Languages | 6 days | 2 days | 10 days |
| Repo Pin | 10 days | 1 day | 10 days |
| Gist | 2 days | 1 day | 10 days |
| WakaTime | 24 h | 12 h | 48 h |
| Streak | 24 h | 12 h | 48 h |

---

## 🚀 Deploy Your Own

Self-hosting gives you private-repo stats, higher rate limits, and full control over caching.

### Option 1 — Vercel (recommended)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/anuraghazra/github-readme-stats)

1. Click **Deploy to Vercel** and import this repository
2. [Create a GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` and `read:user` scopes
3. In Vercel → **Settings → Environment Variables**, add `PAT_1` with your token value
4. Redeploy — done

### Option 2 — Local development

```bash
# Clone
git clone https://github.com/anuraghazra/github-readme-stats.git
cd github-readme-stats
npm install

# Configure
cp .env.local.example .env.local
# Add your token: PAT_1=ghp_xxxxxxxxxxxxxxxxxx

# Run
npm run dev     # → http://localhost:3000/url-builder
npm run build   # production build
npm start       # production server
```

### Personal Access Token scopes

**Classic token** — enable: `repo`, `read:user`

**Fine-grained token** — enable repository permissions:
`Commit statuses (read)` · `Contents (read)` · `Issues (read)` · `Metadata (read)` · `Pull requests (read)`

> [!NOTE]
> Fine-grained tokens limit contributions to public repositories only. Use a classic token if you need private commit counts.

---

## 🔧 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PAT_1` | Primary GitHub Personal Access Token | ✅ |
| `PAT_2` … `PAT_N` | Additional tokens — used as failovers when the previous token is rate-limited | no |
| `CACHE_SECONDS` | Global cache override in seconds; set to `0` to disable caching entirely | no |
| `WHITELIST` | Comma-separated usernames permitted to use this instance; leave unset to allow all | no |
| `GIST_WHITELIST` | Comma-separated gist IDs permitted on this instance | no |
| `EXCLUDE_REPO` | Comma-separated repository names to exclude globally from all stats | no |
| `FETCH_MULTI_PAGE_STARS` | Set `true` to paginate all star pages for accurate counts on large profiles (uses more API quota) | no |

> [!WARNING]
> Restart or redeploy after changing environment variables — Next.js reads them at build/start time.

---

## 📐 Aligning Cards Side by Side

GitHub Markdown doesn't lay images inline by default. Use HTML `<a>` + `<img>` pairs:

```html
<!-- Stats + Top Languages -->
<a href="https://github.com/anuraghazra/github-readme-stats">
  <img height="200" src="https://github-readme-stats.vercel.app/api?username=anuraghazra" />
</a>
<a href="https://github.com/anuraghazra/github-readme-stats">
  <img height="200" src="https://github-readme-stats.vercel.app/api/top-langs?username=anuraghazra&layout=compact&langs_count=8&card_width=320" />
</a>
```

```html
<!-- Two pinned repos -->
<a href="https://github.com/anuraghazra/github-readme-stats">
  <img src="https://github-readme-stats.vercel.app/api/pin/?username=anuraghazra&repo=github-readme-stats" />
</a>
<a href="https://github.com/anuraghazra/convoychat">
  <img src="https://github-readme-stats.vercel.app/api/pin/?username=anuraghazra&repo=convoychat" />
</a>
```

---

## 🔌 API Reference

### Card endpoints

| Endpoint | Returns | Description |
|---|---|---|
| `GET /api` | `image/svg+xml` | GitHub stats card |
| `GET /api/pin` | `image/svg+xml` | Repository pin card |
| `GET /api/top-langs` | `image/svg+xml` | Top languages card |
| `GET /api/streak` | `image/svg+xml` | Activity streak card |
| `GET /api/wakatime` | `image/svg+xml` | WakaTime stats card |
| `GET /api/gist` | `image/svg+xml` | Gist card |

### Status endpoints

| Endpoint | Returns | Description |
|---|---|---|
| `GET /api/status/up` | `boolean` | `true` if at least one PAT is functional |
| `GET /api/status/up?type=json` | JSON | `{ "up": true }` |
| `GET /api/status/up?type=shields` | JSON | [shields.io endpoint](https://shields.io/endpoint) format |
| `GET /api/status/pat-info` | JSON | Lists valid, expired, exhausted, and suspended PATs |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) App Router |
| Language | TypeScript + JavaScript (`allowJs: true`) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Testing | [Jest](https://jestjs.io) + [jsdom](https://github.com/jsdom/jsdom) |
| Deployment | [Vercel](https://vercel.com) |
| GitHub API | [GraphQL API v4](https://docs.github.com/en/graphql) |
| WakaTime API | [WakaTime API v1](https://wakatime.com/developers) |

### Project structure

```
app/
├── globals.css               # @import "tailwindcss" + CSS custom properties
├── layout.tsx                # Root layout
├── page.tsx                  # Redirects / → /url-builder
├── url-builder/
│   └── page.tsx              # Interactive URL builder (React, Tailwind)
└── api/
    ├── route.ts              # GET /api         → stats card
    ├── pin/route.ts          # GET /api/pin
    ├── top-langs/route.ts    # GET /api/top-langs
    ├── streak/route.ts       # GET /api/streak
    ├── wakatime/route.ts     # GET /api/wakatime
    ├── gist/route.ts         # GET /api/gist
    └── status/
        ├── up/route.ts
        └── pat-info/route.ts

src/
├── cards/          # SVG card renderers
├── common/         # Shared utilities (Card, render, color, cache…)
├── fetchers/       # GitHub + WakaTime API clients
├── calculateRank.js
└── translations.js

tests/              # 17 Jest test files
themes/             # Built-in theme definitions
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

```bash
# Install dependencies
npm install

# Run the test suite
npm test

# Watch mode
npm run test:watch

# Type-check
npm run type-check

# Lint
npm run lint

# Format
npm run format
```

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## ❤️ Support the Project

If GitHub Readme Stats has been useful to you, consider:

- ⭐ Starring this repository
- 💬 Sharing it with others
- 💖 [Sponsoring the original author](https://www.paypal.me/anuraghazra)

---

<p align="center">
  Made with ❤️ and JavaScript
  &nbsp;·&nbsp;
  <a href="https://vercel.com?utm_source=github_readme_stats_team&utm_campaign=oss">
    Powered by Vercel
  </a>
</p>