# Yahshud Chatbot — Prompt Evaluation Tool

A lightweight evaluation tool for testing the Yahshud / RAIN Islamic investment chatbot across 50 structured prompts.

## Structure

```
akhi_evaluation/
├── server.js          # Express server — serves the app and handles data persistence
├── package.json
├── data.json          # Persisted evaluation results (auto-created, gitignore if private)
└── public/
    └── index.html     # The evaluation UI
```

## Run locally

```bash
npm install
npm start
# → http://localhost:3000
```

For development with auto-reload (Node 18+):
```bash
npm run dev
```

## Deploy to production

This is a standard Express app. Works on any Node.js host:

**Render / Railway / Fly.io**
```bash
# Set start command to: node server.js
# Set PORT env variable if required (defaults to 3000)
```

**PM2 (VPS)**
```bash
npm install -g pm2
pm2 start server.js --name yahshud-eval
pm2 save
```

## How persistence works

- All editable cells (Actual Response, Pass/Fail, Notes) are auto-saved to the server on blur
- The Save button forces a full explicit save and shows a timestamp toast
- Data is written to `data.json` on the server — one flat JSON object keyed by `{ID}_{field}`
- On page load, the app fetches saved data from `GET /api/data` and restores all fields
- Works across all browsers and devices — anyone on the same URL sees the same data

## API

| Method | Endpoint    | Description                          |
|--------|-------------|--------------------------------------|
| GET    | `/api/data` | Returns persisted evaluation data    |
| POST   | `/api/data` | Replaces persisted data with payload |
