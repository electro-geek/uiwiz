# Deploy UIWiz on Vercel (Free Tier)

This guide walks you through deploying the **frontend** of UIWiz on Vercel at no cost.

---

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free).
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket).

---

## Step 1: Push Your Code to Git

If you haven’t already:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 2: Import Project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New…** → **Project**.
3. **Import** your repository (e.g. `uiwiz`).
4. Do **not** deploy yet — configure the project first.

---

## Step 3: Set Root Directory (Important)

The app lives in the `frontend` folder:

1. In the import screen, find **Root Directory**.
2. Click **Edit** and set it to: **`frontend`**.

---

## Step 4: Build & Output Settings

In **Build and Output Settings** (expand it if needed), set:

| Setting | Value |
|--------|--------|
| **Framework Preset** | **Vite** |
| **Install Command** | `npm install` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

- **Framework Preset:** Choose **Vite** from the dropdown (not Create React App or Other).
- **Install Command:** Vercel runs this first to install dependencies. Use `npm install`.
- **Build Command:** This runs your Vite build. Use `npm run build`.
- **Output Directory:** Vite builds into `dist`. Enter `dist` (relative to the root directory, i.e. `frontend`).

If you leave Framework Preset as **Vite**, Vercel often fills the rest automatically; you can still override Install/Build/Output if needed.

---

## Step 5: Add Environment Variables

1. Expand **Environment Variables** in the import screen (or add them later in **Settings → Environment Variables**).
2. Add each variable from `frontend/.env.example` (use the same names).
3. For **production**, set:
   - **`VITE_API_BASE_URL`** – Your backend API URL (e.g. `https://your-api.vercel.app/api`).  
     If you only deploy the frontend and use Firebase/other APIs, you can keep a placeholder or your real API URL.
   - **Firebase variables** – Copy the values from your local `frontend/.env` (from Firebase Console → Project settings).

Add them for **Production** (and optionally Preview) so builds and runtime use the correct config.

---

## Step 6: Deploy

1. Click **Deploy**.
2. Wait for the build to finish (free tier is enough for this).
3. Vercel will give you a URL like `https://your-project.vercel.app`.

---

## Step 7: Optional – Custom Domain (Free Tier)

1. Open your project on Vercel → **Settings** → **Domains**.
2. Add your domain and follow the DNS instructions.
3. Free tier includes one custom domain per project.

---

## Summary of What’s Configured

| Item | Value |
|------|--------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Install Command** | `npm install` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Env vars** | Set in Vercel dashboard from `frontend/.env.example` |

---

## Troubleshooting

- **Build fails**: Check the build log; ensure **Root Directory** is `frontend` and **Node.js** version is 18+ (set in Project → Settings → General if needed).
- **Blank page or wrong routes**: The project uses `vercel.json` rewrites so all routes serve `index.html` (SPA). If you change routing, you may need to adjust `rewrites`.
- **API / Firebase errors**: Confirm all `VITE_*` env vars are set in Vercel for the correct environment (Production/Preview).

---

## Deploying from CLI (Alternative)

From the **repository root**:

```bash
cd frontend
npx vercel
```

Follow the prompts and set **Root Directory** to the current directory when asked. For production:

```bash
npx vercel --prod
```

Environment variables can be added in the Vercel dashboard or with `vercel env add`.
