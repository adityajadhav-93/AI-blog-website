# The Signal

A responsive editorial-style AI and technology publication built with React, TypeScript, Vite, and Express. The default edition contains AI-generated sample stories, clearly labeled as demonstrations and never presented as live reporting.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The development command starts both the frontend and local API service. Without an API key, the app stays in its sample edition.

## Production server

```sh
npm run build
npm start
```

Express serves the built app and API on `http://localhost:4174` by default. Set `API_PORT` in `.env` to change the port.

## Optional live headlines

1. Copy `.env.example` to `.env`.
2. Set `NEWS_API_KEY` to a NewsAPI.org key.
3. Restart `npm run dev`.

The key is read only by Express and is not exposed to browser code. With a working key, the app requests English headlines from NewsAPI and labels them as live-source results. Plan limits and source availability apply. Sample stories remain available when live data is not configured or returned.

## Checks

```sh
npm run lint
npm run build
```

## Features

- Home, latest, trending, topic directory and filters, article details, search, saved stories, About, and Contact routes.
- Responsive navigation, light/dark themes, reduced-motion support, loading skeletons, empty states, and missing-page handling.
- Saved stories, theme preference, and demo newsletter confirmation persist in browser storage.
- Article sharing, copy-link action, and source links for live results.
- Newsletter and contact forms show local confirmations only; they do not send email.
- No database is required. The optional Express endpoint proxies NewsAPI so its key stays server-side.

## Notes

Built-in stories are AI-generated samples, not factual reporting. Images are illustrative and loaded from Unsplash. Live article summaries link to their original publishers; NewsAPI does not provide full article text.
