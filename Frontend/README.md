# Email Analysis App UI (Frontend)
This repository contains the frontend for the Email Analysis App. It is a Vite + React UI that was built to work with a backend API which provides email analysis, history and related endpoints.
If you're creating or running the backend, this README explains how to configure the frontend to talk to it and how to run/build the UI locally.
**Tech Stack:**
- **Framework:** React (TSX)
- **Bundler:** Vite (with `@vitejs/plugin-react-swc`)
- **UI primitives:** Radix UI, Tailwind-based utilities and custom components
- **Icons:** `lucide-react`

**Key dependencies (from `package.json`):** `react`, `react-dom`, `vite`, `@vitejs/plugin-react-swc`, `lucide-react`, Radix UI packages (accordion, dialog, popover, etc.), `recharts`, `react-hook-form`, `sonner`.

**Prerequisites**
- Node.js (LTS recommended, e.g. Node 18+)
- npm (or optionally `pnpm` / `yarn`)

**Repository Scripts**
- `npm run dev` — Start the dev server (Vite)
- `npm run build` — Build production assets (Vite)

Run these commands to get started:

```powershell
npm install
npm run dev
```

or, with `pnpm`:

```powershell
npm i -g pnpm
pnpm install
pnpm dev
```

**Environment / Backend integration**

The frontend expects a base API URL to be available at build/runtime. By convention this project uses Vite environment variables. Create a file named `.env` (or `.env.local`) at the project root with a variable such as:

```text
VITE_API_BASE_URL=http://localhost:3000/api
```

- The app should access the backend via `import.meta.env.VITE_API_BASE_URL` (for example: `${import.meta.env.VITE_API_BASE_URL}/analyze`).
- Make sure the backend enables CORS for the frontend origin during development (e.g., `http://localhost:5173` when Vite runs on default port).

If your backend exposes specific endpoints, map them accordingly in the frontend config or code (search for references to `VITE_API_BASE_URL` inside `src/`).

**Folder structure (important files)**
- `src/` — Application source (components, pages, styles)
- `src/main.tsx` — App entry
- `src/App.tsx` — Top-level app / routes
- `src/components/` — React components used by the UI
- `src/styles/` — Global styles / Tailwind config (if present)
- `index.html` — Vite HTML entry

**Common backend-related tasks**
- During backend development, run the backend on a known port and set `VITE_API_BASE_URL` to point to it.
- If the backend uses authentication, add the appropriate token retrieval (cookie, header) and update requests in the frontend.

**Troubleshooting**
- If `npm install` fails with network errors like `ECONNRESET`, try:
  - `npm cache clean --force`
  - `npm set registry https://registry.npmjs.org/`
  - Increase fetch retries: `npm set fetch-retries 5` and set timeouts
  - If you're behind a corporate proxy, set `npm config set proxy` / `https-proxy` appropriately or use a different network
  - Try alternative package managers: `pnpm install` or `yarn install`

**Build & Deploy**
- `npm run build` produces static assets in `dist/` which you can serve from any static host or integrate into your backend's static serving path.
- Ensure that runtime environment (if serving statically) provides the correct API base URL to the client, e.g. using environment replacement at build time or runtime config pattern.

**Contributing / Notes**
- Keep UI components focused and add tests for complex logic where appropriate.
- If you add new backend routes, update the frontend API helpers and document them here.

If you'd like, I can also:
- Add a small `env.example` file with the `VITE_API_BASE_URL` example
- Search the code for every usage of `import.meta.env.VITE_API_BASE_URL` and list the endpoints the frontend calls

---
*This README was updated to help backend developers connect their services to the frontend quickly.*


  # Email Analysis App UI

  This is a code bundle for Email Analysis App UI. The original project is available at https://www.figma.com/design/KouHImlyl18eeb43B6no7p/Email-Analysis-App-UI.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  