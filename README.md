# InsightMail - AI-Powered Email Analysis Platform

InsightMail is a full-stack application that uses Ollama (Gemma 2B) AI to analyze emails for sentiment, intent, compliance risks, and urgency while providing intelligent reply suggestions. The platform features a modern React frontend with a unique dark glassmorphism UI, real-time analytics, and a FastAPI backend with SQLite persistence.

## 🌟 Key Features

- **AI-Powered Email Analysis**: Leverages Ollama (Gemma 2B) to detect intent, emotion, urgency, and compliance issues with robust fallback for unparseable responses
- **RAG (Retrieval-Augmented Generation)**: Vector similarity search using nomic-embed-text embeddings for context-aware analysis with company knowledge base
- **Smart Reply Generation**: Context-aware reply suggestions with multiple tone options (formal, empathetic, friendly, assertive, professional)
- **Risk Assessment**: Multi-dimensional risk scoring (0-100 scale) with detailed breakdown: emotion intensity, priority, compliance risk, escalation likelihood
- **Action Item Extraction**: Automatically identifies actionable tasks from emails
- **Compliance Detection**: Flags policy violations and compliance issues
- **Analytics Dashboard**: Visual insights with sentiment trends, intent distribution, compliance heatmaps, and urgency analysis
- **History Tracking**: Persistent storage of all email analyses with timestamps
- **Knowledge Base Management**: Add, list, and manage RAG documents (policies, FAQs, guidelines)

## 🏗️ Architecture

### Frontend (`frontend/`)
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5 with `@vitejs/plugin-react-swc`
- **UI**: Custom dark gradient theme, glassmorphism, Radix UI primitives, Tailwind CSS
- **Charts**: Recharts 2.15.2 for data visualization
- **Forms**: React Hook Form 7.55.0 with validation
- **Notifications**: Sonner 2.0.3 for toast messages
- **Icons**: Lucide React 0.487.0
- **Utilities**: clsx, tailwind-merge, class-variance-authority

### Backend (`backend/`)
- **Framework**: FastAPI with Uvicorn ASGI server
- **AI Model**: Ollama (gemma:2b) with fallback text extraction
- **Embeddings**: Ollama (nomic-embed-text) for RAG
- **RAG**: Vector similarity search with cosine similarity
- **Database**: SQLite with SQLAlchemy ORM (PostgreSQL optional)
- **Validation**: Pydantic v2

## 📋 Prerequisites

- **Node.js** 18+ (LTS recommended for frontend)
- **Python** 3.9+ (for backend)
- **Ollama** installed and running ([Download here](https://ollama.ai))
- **Required Ollama Models**:
  ```bash
  ollama pull gemma:2b
  ollama pull nomic-embed-text
  ```
- **Git** (for version control)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Anand-b-patil/InsightMail.git
cd InsightMail
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (optional, defaults work fine)
cp .env.example .env

# Ensure Ollama is running
curl http://localhost:11434/api/tags

# Pull required models
ollama pull gemma:2b
ollama pull nomic-embed-text

# Run the server
cd app
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`
- Swagger UI docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

**Optional**: Seed the knowledge base with sample documents:
```bash
python scripts/seed_knowledge_base.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
InsightMail/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── EmailAnalyzer.tsx      # Main email analysis UI
│   │   │   ├── Dashboard.tsx          # Analytics dashboard
│   │   │   ├── HistoryPage.tsx        # Analysis history
│   │   │   ├── SettingsPage.tsx       # App settings
│   │   │   └── ui/                    # Radix UI & custom components
│   │   ├── services/
│   │   │   └── api.ts                 # Backend API client
│   │   ├── App.tsx                    # Main app component
│   │   └── main.tsx                   # App entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── api/                # API route handlers
│   │   │   ├── analyze.py             # Email analysis endpoint
│   │   │   ├── history.py             # History management
│   │   │   ├── dashboard.py           # Analytics data
│   │   │   └── settings.py            # Settings CRUD
│   │   ├── db/                 # Database layer
│   │   │   ├── models.py              # SQLAlchemy models
│   │   │   └── session.py             # DB session factory
│   │   ├── core/
│   │   │   └── config.py              # Configuration settings
│   │   ├── services/           # Business logic
│   │   │   ├── llm_service.py         # Ollama LLM integration
│   │   │   ├── rag_service.py         # RAG functionality
│   │   │   └── pipeline.py            # Analysis orchestration
│   │   ├── routers/            # API route handlers (updated)
│   │   │   ├── analyze.py             # Email analysis endpoint
│   │   │   ├── history.py             # History management
│   │   │   ├── analytics.py           # Analytics data
│   │   │   ├── settings.py            # Settings CRUD
│   │   │   └── knowledge_base.py      # RAG knowledge base
│   │   └── schemas/            # Pydantic models
│   │       └── __init__.py            # Request/response schemas
│   ├── main.py                 # FastAPI app entry
│   ├── sample_data/            # Sample RAG documents
│   ├── scripts/
│   │   └── seed_knowledge_base.py     # KB seeding script
│   ├── requirements.txt
│   └── .env.example
│
└── README.md                    # This file
```

## 🔌 API Endpoints

### Analysis
- **POST** `/api/analyze` - Analyze email and generate insights
  - Request: `{ "email": "string", "tone": "professional" }`
  - Response: Full analysis with intent, emotion, urgency, compliance flags, summary, action items, risk score, smart reply, and RAG context

### History
- **GET** `/api/history?limit=50&offset=0` - Get analysis records with pagination

### Analytics Dashboard
- **GET** `/api/analytics?days=30` - Get aggregated analytics metrics
  - Returns: sentiment trends, intent distribution, compliance trends, urgency over time

### Settings
- **GET** `/api/settings` - Get current application settings
- **POST** `/api/settings` - Update application settings
  - Configure: enable_rag, enable_compliance_check, enable_risk_scoring, enable_smart_reply, rag_top_k, default_tone

### Knowledge Base (RAG)
- **POST** `/api/kb/add` - Add document to knowledge base
- **GET** `/api/kb/list` - List all knowledge base documents
- **DELETE** `/api/kb/{document_id}` - Delete a knowledge base document

## 🛠️ Environment Configuration

### Backend (`.env`)
```env
# Database
DATABASE_URL=sqlite:///./insightmail.db

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma:2b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
OLLAMA_TIMEOUT=120

# RAG Settings
RAG_TOP_K=3
RAG_SIMILARITY_THRESHOLD=0.5

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🧪 Testing

### Test with curl

```bash
# Analyze email
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"email": "This is urgent! We need to fix the security breach immediately.", "tone": "professional"}'

# Get history
curl http://localhost:8000/api/history

# Get analytics
curl http://localhost:8000/api/analytics
```

### Test with Swagger UI

Navigate to `http://localhost:8000/docs` for interactive API documentation and testing.

## 📊 Features Overview

### Email Analyzer
- Real-time email analysis with AI insights powered by Ollama
- RAG-enhanced analysis using company knowledge base
- Tone selection for smart replies (formal, empathetic, friendly, assertive, professional)
- Detailed emotion detection with reasoning (with fallback for unparseable LLM output)
- Intent classification and urgency assessment
- Compliance flag detection and PII identification
- Summary generation and action item extraction
- Risk score (0-100) with breakdown: emotion intensity, priority, compliance risk, escalation likelihood

### Analytics Dashboard
- Sentiment trends over time (line chart)
- Intent distribution (bar chart)
- Compliance trends tracking
- Urgency analysis over time
- Overall statistics and metrics

### History Page
- Chronological list of all analyzed emails
- Preview of email content
- Risk scores and timestamps
- Quick access to past analyses

### Settings
- Toggle features: RAG, compliance check, risk scoring, smart reply
- Configure RAG parameters (top_k, similarity threshold)
- Set default tone for replies
- Customize application behavior

## 🐛 Troubleshooting

### Frontend npm install fails (ECONNRESET)
```bash
npm cache clean --force
npm set registry https://registry.npmjs.org/
npm set fetch-retries 5
npm install
```

### Ollama Not Running
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama (if not running)
ollama serve
```

### Models Not Found
```bash
# Pull required models
ollama pull gemma:2b
ollama pull nomic-embed-text

# Verify models are installed
ollama list
```

### CORS errors
- Verify `CORS_ORIGINS` in backend `.env` matches your frontend URL
- Default frontend runs on `http://localhost:5173`
- Add your frontend URL to CORS_ORIGINS if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Anand B Patil**
- GitHub: [@Anand-b-patil](https://github.com/Anand-b-patil)

- **Sanjay Prakash Chavan**
- GitHyb: https://github.com/sanjaychavan05

## 🙏 Acknowledgments

- Ollama for local LLM deployment and embeddings
- Radix UI for accessible component primitives
- FastAPI for the excellent Python web framework
- React and Vite teams for modern web development tools
- Recharts for beautiful data visualization
- Tailwind CSS for utility-first styling

## 📚 Additional Resources

- [Frontend README](./frontend/README.md) - Detailed frontend documentation
- [Backend README](./backend/README.md) - Complete backend API documentation
- [Ollama Documentation](https://github.com/ollama/ollama) - LLM setup and usage

---

**Built with ❤️ using React, FastAPI, and Ollama (Gemma 2B)**
