# Lumina — AI-Powered UI Generator (Frontend)

Lumina is a world-class AI interface generator that allows users to create high-fidelity React components using Google Gemini AI. This repository contains the modern React frontend, built with Vite, TypeScript, and Tailwind CSS.

## ✨ Key Features

- **Real-time Generation**: Watch UI components being built live as AI streams the code.
- **Instant Preview**: Integrated **Sandpack-based** preview environment for executing generated React + Tailwind code.
- **User API Keys**: Users provide their own Gemini API keys, allowing for scalable, personalized usage without backend costs.
- **Session History**: Persisted chat sessions and version history to track iterations.
- **Premium Aesthetics**: Polished UI with glassmorphism, smooth animations (Framer Motion), and dark mode by default.

## 🚀 Tech Stack

- **React 18** + **Vite**
- **TypeScript**
- **Tailwind CSS** (for styling)
- **Framer Motion** (for animations)
- **Lucide React** (icons)
- **Sandpack-React** (live preview engine)
- **Axios** (API communication)

## 🛠️ Setup and Installation

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm/yarn** installed.

### 2. Configure Environment Variables
Create a `.env` file in the root of the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8001/api
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## ⚙️ Configuration (Gemini API)

Lumina requires a **Gemini API Key** to function. 
1. Open the app and log in.
2. Click on the **Settings** button in the bottom-left corner of the sidebar.
3. Paste your Gemini API key (get one for free at [Google AI Studio](https://aistudio.google.com/app/apikey)).
4. Save, and you're ready to start generating!

## 🧪 Development Workflow

- **Components**: UI components are located in `src/components/`.
- **API Client**: The backend communication logic is in `src/lib/api.ts`.
- **Types**: Shared TypeScript types are in `src/types/index.ts`.
- **Styling**: Global styles and utility tokens are in `src/index.css`.

---
Built with ❤️ by the Lumina Team.
