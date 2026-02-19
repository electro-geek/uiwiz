# UIWiz — AI-Powered UI Generator

**UIWiz** is an AI-native UI development platform that turns natural language into production-ready React components. Describe what you want in plain English, and get real React + Tailwind code with a live preview—no design tools or handoff required.

---

## What is UIWiz?

UIWiz bridges the gap between idea and interface. You describe a UI (e.g. “a landing page with hero and pricing”, “an analytics dashboard with charts”), and the app uses **Google Gemini AI** to generate React components in real time. You can preview the result on desktop, tablet, or mobile, copy the code, and iterate by chatting again.

- **Describe** — Tell UIWiz what you want in a sentence.  
- **Generate** — Get streaming React & Tailwind code.  
- **Preview** — See it live and ship it.

The app uses a **black-and-white gradient** theme and supports **email/password** and **Google** sign-in. Users bring their own **Gemini API key** (stored securely via the backend), so generation scales without backend AI costs.

---

## Features

| Feature | Description |
|--------|-------------|
| **Real-time code generation** | AI streams React/JSX code as it’s generated; you see the preview update live. |
| **Live preview** | Sandpack-powered preview runs the generated code; switch between desktop, tablet, and mobile. |
| **Code view** | Toggle to raw code view and copy the component to your project. |
| **Chat sessions** | Multiple sessions (chats) with history; each session keeps messages and generated versions. |
| **Your Gemini key** | You add your own Google Gemini API key in Settings; the backend stores it per user. |
| **Auth** | Sign up / log in with email and password, or with Google (Firebase). |

---

## Project structure

```
uiwiz/
├── frontend/                 # React + Vite app (this repo’s main app)
│   ├── public/               # Static assets (e.g. logo.svg)
│   ├── src/
│   │   ├── components/       # React components (App, Sidebar, Chat, Preview, Auth, etc.)
│   │   ├── lib/             # API client (api.ts), Firebase (firebase.ts)
│   │   ├── types/           # Shared TypeScript types
│   │   ├── App.tsx          # Root component, auth flow, session/code state
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles and theme (B&W gradient)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env.example         # Env vars template
│   └── vercel.json          # Vercel config (root = frontend)
├── VERCEL_DEPLOY.md         # How to deploy the frontend on Vercel
└── README.md                # This file
```

The frontend talks to a **backend API** (not included in this repo). The backend typically provides:

- **Auth**: `POST /api/login/`, `POST /api/register/`, `POST /api/google-login/`
- **Sessions**: `GET/POST /api/sessions/`, `GET/DELETE /api/sessions/:id/`
- **Profile**: `GET/POST /api/profile/` (e.g. store Gemini API key)
- **Generate**: `POST /api/generate/` (streaming; uses the user’s Gemini key)
- **Health**: `GET /api/health/` (e.g. `gemini_configured`)

---

## Tech stack

- **React 19** + **Vite 7** — UI and build
- **TypeScript** — Typing
- **CSS** — Global theme and layout in `index.css` (no Tailwind in the current build)
- **Framer Motion** — Animations (e.g. preview splash)
- **Lucide React** — Icons
- **Sandpack (CodeSandbox)** — In-browser preview of generated React code
- **Axios** — HTTP client for the backend API
- **Firebase** — Google sign-in
- **React Syntax Highlighter** — Code view styling

---

## Prerequisites

- **Node.js** (v18+) and **npm**
- **Backend API** running (e.g. at `http://localhost:8000`) and implementing the endpoints above
- **Firebase project** (if you use Google sign-in)
- **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey) (each user adds their own in the app)

---

## Setup and run

### 1. Clone and install

```bash
git clone <repository-url>
cd uiwiz
cd frontend
npm install
```

### 2. Environment variables

Copy the example env file and set your values:

```bash
cp .env.example .env
```

Edit `.env` in `frontend/`:

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:8000/api`) |
| `VITE_FIREBASE_*` | Firebase config (API key, auth domain, project ID, etc.) for Google sign-in |

### 3. Run the dev server

```bash
npm run build   # optional: check build
npm run dev     # start dev server
```

The app is usually at **http://localhost:5173**.

### 4. Using the app

1. Sign up or log in (email/password or Google).
2. In **Settings** (sidebar), add your **Gemini API key** (from [Google AI Studio](https://aistudio.google.com/app/apikey)).
3. Start a **New Chat**, describe a UI (e.g. “A dark pricing page with three tiers”), and watch the preview and code update as the AI streams.

---

## Configuration

- **Gemini API key** — Required for generation. Users set it in Settings; the backend stores it in the user profile.
- **Backend URL** — Set via `VITE_API_BASE_URL` so the frontend calls your API.
- **Firebase** — Only needed if you use Google login; configure the `VITE_FIREBASE_*` variables.

---

## Deployment

The frontend is deployable as a static Vite app (e.g. on **Vercel**). Set the **root directory** to `frontend`, use **Vite** as the framework, and set `VITE_API_BASE_URL` (and Firebase vars if used) in the deployment environment. See **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** for step-by-step Vercel instructions.

---

## Main UI areas

- **Landing / auth** — Login, signup, and a short product pitch with feature tabs (Describe, Generate, Preview).
- **Sidebar** — New chat, list of sessions, settings (Gemini key), logout.
- **Chat panel** — Message history, suggestions, and input (text + optional image) for prompts.
- **Preview panel** — Sandpack live preview; device toggles (desktop/tablet/mobile); empty state with “UIWiz” and short instructions.
- **Top bar** — Toggle Preview vs Code view; copy code; device mode.
- **Status bar** — Connection status (e.g. “Connected to Gemini” or “API Key Required”).
- **Modals** — API key configuration, rate-limit message, delete-session confirmation, “Meet the Creator” (with GitHub link).

---

## License and credit

Use and adapt as allowed by the project’s license.  
Built with ❤️ by the UIWiz team. Creator: [electro-geek](https://github.com/electro-geek).
