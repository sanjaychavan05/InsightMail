# InsightMail Frontend

Modern React frontend for the InsightMail AI-powered email analysis platform. Features a clean, responsive UI with real-time analytics, email analysis, and intelligent reply generation.

## 🎨 Features

### Email Analyzer
- Real-time email content analysis powered by AI
- Multiple tone options for smart replies (formal, empathetic, friendly, assertive)
- Detailed insights: intent, emotion, urgency, compliance
- PII detection and flagging
- Risk score visualization with detailed breakdown

### Analytics Dashboard
- **Sentiment Trends**: Line chart showing sentiment over time
- **Intent Distribution**: Bar chart for email intent analysis
- **Compliance Heatmap**: Visual representation of compliance issues
- Overall statistics and metrics

### History Page
- Chronological list of all analyzed emails
- Quick preview of email content
- Risk scores and analysis timestamps
- Easy access to historical data

### Settings
- Feature toggles for app functionality
- API endpoint configuration
- Customizable application behavior

## 🛠️ Tech Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5 (with `@vitejs/plugin-react-swc`)
- **UI Components**: Radix UI primitives (accessible, unstyled components)
- **Styling**: Tailwind CSS with custom utilities
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with validation
- **Notifications**: Sonner for toast messages
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## 📋 Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (or optionally `pnpm` / `yarn`)
- **Backend API** running on `http://localhost:8000` (see backend README)

## 🚀 Installation & Setup

### 1. Install dependencies

```bash
npm install
```

Or with pnpm:

```bash
npm i -g pnpm
pnpm install
```

### 2. Configure environment

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

This tells the frontend where to find the backend API.

### 3. Run development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for production

```bash
npm run build
```

Production assets will be generated in the `dist/` folder.

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/              # React components
│   │   ├── EmailAnalyzer.tsx   # Main email analysis interface
│   │   ├── Dashboard.tsx       # Analytics dashboard
│   │   ├── HistoryPage.tsx     # Analysis history viewer
│   │   ├── SettingsPage.tsx    # Application settings
│   │   ├── AnalysisCard.tsx    # Analysis result display
│   │   ├── EmotionInsight.tsx  # Emotion visualization
│   │   ├── RiskScore.tsx       # Risk score component
│   │   ├── SmartReply.tsx      # Reply suggestions display
│   │   ├── LoadingOverlay.tsx  # Loading state
│   │   └── ui/                 # Radix UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── tabs.tsx
│   │       ├── select.tsx
│   │       ├── switch.tsx
│   │       ├── textarea.tsx
│   │       └── ... (30+ components)
│   ├── services/
│   │   └── api.ts              # Backend API client
│   ├── styles/
│   │   └── globals.css         # Global styles
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx                # App entry point
│   └── index.css               # Tailwind imports
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── package.json                # Dependencies and scripts
└── .env                        # Environment variables (create this)
```

## 🔌 API Integration

The frontend communicates with the backend via `src/services/api.ts`:

### Available Functions

```typescript
// Analyze an email
analyzeEmail(email: string, tone?: string): Promise<AnalysisResult>

// Get analysis history
getHistory(limit?: number): Promise<HistoryRecord[]>

// Get dashboard metrics
getDashboardMetrics(): Promise<DashboardMetrics>

// Get application settings
getSettings(): Promise<Settings>

// Update application settings
updateSettings(settings: Settings): Promise<void>
```

### TypeScript Interfaces

All API types are defined in `api.ts`:
- `AnalysisResult` - Full email analysis response
- `HistoryRecord` - Historical analysis record
- `DashboardMetrics` - Analytics data
- `Settings` - Application configuration

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

Access in code: `import.meta.env.VITE_API_BASE_URL`

## 🐛 Troubleshooting

### npm install fails with ECONNRESET

```bash
# Clean cache
npm cache clean --force

# Set registry
npm set registry https://registry.npmjs.org/

# Increase retries and timeout
npm set fetch-retries 5
npm set fetch-retry-mintimeout 20000
npm set fetch-retry-maxtimeout 120000

# Try again
npm install
```

### CORS errors when calling backend

Ensure the backend has CORS configured for `http://localhost:5173`:

```python
# backend/main.py
origins = [
    "http://localhost:5173",  # Frontend URL
]
```

### API calls failing

1. Verify backend is running on `http://localhost:8000`
2. Check `.env` file has correct `VITE_API_BASE_URL`
3. Restart Vite dev server after changing `.env`

### Components not rendering correctly

1. Clear Vite cache: `rm -rf node_modules/.vite`
2. Reinstall dependencies: `npm install`
3. Restart dev server: `npm run dev`

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI framework |
| `vite` | ^6.3.5 | Build tool |
| `@radix-ui/*` | Various | Accessible UI primitives |
| `recharts` | ^2.15.2 | Data visualization |
| `lucide-react` | ^0.487.0 | Icon library |
| `react-hook-form` | ^7.55.0 | Form management |
| `sonner` | ^2.0.3 | Toast notifications |
| `tailwindcss` | * | Utility-first CSS |

## 🚀 Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)

```bash
# Build the app
npm run build

# Deploy the dist/ folder
```

### Backend Integration

If deploying with the backend, ensure:
1. Backend serves CORS headers for your frontend domain
2. Update `VITE_API_BASE_URL` to your production backend URL
3. Rebuild frontend after environment changes

### Environment-specific Builds

```bash
# Development build
npm run build -- --mode development

# Production build
npm run build -- --mode production
```

## 🤝 Contributing

1. Follow the existing component structure
2. Use TypeScript for type safety
3. Keep components focused and reusable
4. Add proper error handling
5. Update this README when adding new features

## 📝 Notes

- All UI components are based on Radix UI for accessibility
- Tailwind CSS is configured with custom theme extensions
- The app uses React Router for navigation
- State management is handled with React hooks
- API calls include proper error handling and loading states

## 🔗 Related Documentation

- [Backend README](../backend/README.md) - Backend setup and API documentation
- [Main README](../README.md) - Full project overview

---

**Original Design**: [Figma - Email Analysis App UI](https://www.figma.com/design/KouHImlyl18eeb43B6no7p/Email-Analysis-App-UI)
  