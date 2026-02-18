# Project Specification: "UIWiz" – AI-Powered UI Generator

## 🚀 Quick Start

To start both the frontend and backend services with a single command:

```bash
./start.sh
```

---

## 1. Overview

UIWiz is a web application that allows users to generate, preview, and iterate on React components in real-time using the **Gemini API**. It mimics the "Lovable" or "v0" workflow: Prompt → Code Generation → Instant Rendering.

## 2. Core Tech Stack

* **Framework:** Next.js 14/15 (App Router).
* **Language:** TypeScript.
* **Styling:** Tailwind CSS (Must be pre-configured in the sandbox).
* **Icons:** Lucide-React.
* **AI Engine:** Gemini 2.0 Flash (via `@google/generative-ai`).
* **Code Sandbox:** `@codesandbox/sandpack-react` (for secure, live rendering).

---

## 3. System Architecture & Prompt Engineering

### The "Master" System Instruction

The agent must configure the Gemini API with the following persistent instruction:

> "You are a world-class Frontend Engineer. You output **strictly** executable React code using Tailwind CSS.
> 1. Only return the code; no markdown backticks, no explanations.
> 2. Assume all components are exported as `default`.
> 3. Use `lucide-react` for all icons.
> 4. If the user provides an image, replicate the UI layout and aesthetic exactly.
> 5. All logic must be self-contained in one file."
> 
> 

---

## 4. Key Functional Modules

### A. The Generation Engine (`/api/generate`)

* **Input:** Text prompt + (Optional) Base64 Image.
* **Context:** Pass the *previous* code version back to Gemini if the user is asking for an "edit" (Iterative design).
* **Streaming:** Implement Server-Sent Events (SSE) or simple streaming so the UI updates as the code is being written.

### B. The Live Sandbox (The Previewer)

* **Sandpack Integration:** Set up a `SandpackProvider` with a custom template.
* **Dependencies:** Pre-load `lucide-react`, `framer-motion`, and `clsx` into the sandbox environment.
* **Error Handling:** If the generated code crashes, catch the error and display a "Fixing..." state while sending the error log back to Gemini automatically.

### C. Version Control (The "Timeline")

* Maintain a state array of `versions: { code: string, prompt: string }[]`.
* Allow the user to "Time Travel" back to a previous version if a new prompt breaks the design.

---

## 5. UI/UX Requirements

* **Split Screen:** Left side for the Chat/Prompt input; Right side for the Live Preview.
* **Toggle:** Switch between "Preview" mode and "Code" mode to see the raw output.
* **Responsive Toggle:** Buttons to view the generated UI in Mobile, Tablet, and Desktop widths.
* **Copy to Clipboard:** One-click button to grab the final code.

---

## 6. Implementation Checklist for Antigravity

1. **[ ] Phase 1:** Set up Next.js with Tailwind and install `@google/generative-ai` and `@codesandbox/sandpack-react`.
2. **[ ] Phase 2:** Create a basic chat UI that sends a string to Gemini and logs the response to the console.
3. **[ ] Phase 3:** Integrate Sandpack. Take the string from Gemini and inject it into the `App.js` file of the Sandpack provider.
4. **[ ] Phase 4:** Implement "Image Upload" functionality to leverage Gemini’s vision capabilities.
5. **[ ] Phase 5:** Add "Refinement" logic (sending current code + new prompt = updated code).

---
