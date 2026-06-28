# InsightMail - AI-Powered Email Analysis Platform

InsightMail is a full-stack application that uses Google Gemini AI to analyze emails for sentiment, intent, compliance risks, and urgency while providing intelligent reply suggestions. The platform features a modern React frontend with real-time analytics and a FastAPI backend with SQLite persistence.

## 🌟 Key Features

- **AI-Powered Email Analysis**: Leverages Google Gemini to detect intent, emotion, urgency, and compliance issues
- **Smart Reply Generation**: Context-aware reply suggestions with multiple tone options (formal, empathetic, friendly, assertive)
- **Risk Assessment**: Multi-dimensional risk scoring with detailed breakdown metrics
- **PII Detection**: Identifies and flags personally identifiable information
- **Analytics Dashboard**: Visual insights with sentiment trends, intent distribution, and compliance heatmaps
- **History Tracking**: Persistent storage of all email analyses
- **Mock Mode**: Fallback functionality when Gemini API is unavailable

## 🏗️ Architecture

### Frontend (`Frontend/`)
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Library**: Radix UI components with Tailwind CSS
- **Charts**: Recharts for analytics visualization
- **Forms**: React Hook Form for settings management
- **Notifications**: Sonner for toast notifications

### Backend (`backend/`)
- **Framework**: FastAPI 0.104.1
- **AI Model**: Google Gemini (gemini-pro)
- **Database**: SQLite with SQLAlchemy 2.0.23 ORM
- **Validation**: Pydantic v2.5.0
- **Server**: Uvicorn ASGI server

## 📋 Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.10+ (for backend)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))
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

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run the server
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`
- Swagger UI docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 3. Frontend Setup

```bash
cd Frontend

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
├── Frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── EmailAnalyzer.tsx      # Main email analysis UI
│   │   │   ├── Dashboard.tsx          # Analytics dashboard
│   │   │   ├── HistoryPage.tsx        # Analysis history
│   │   │   ├── SettingsPage.tsx       # App settings
│   │   │   └── ui/                    # Radix UI components
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
│   │   ├── lms/                # LLM integration
│   │   │   ├── gemini_client.py       # Gemini API wrapper
│   │   │   └── prompts.py             # AI prompt templates
│   │   ├── services/           # Business logic
│   │   │   ├── pipeline.py            # Analysis orchestration
│   │   │   └── utils.py               # Helper functions
│   │   └── schemas/            # Pydantic models
│   │       └── analysis.py            # Request/response schemas
│   ├── main.py                 # FastAPI app entry
│   ├── requirements.txt
│   └── .env.example
│
└── README.md                    # This file
```

## 🔌 API Endpoints

### Analysis
- **POST** `/analyze` - Analyze email and generate insights
  - Request: `{ "email": "string", "tone": "empathetic" }`
  - Response: Full analysis with intent, emotion, risk score, smart reply

### History
- **GET** `/history` - Get all analysis records (limit: 50)
- **POST** `/history` - Create new analysis record

### Dashboard
- **GET** `/dashboard` - Get aggregated analytics metrics
  - Returns: sentiment trends, intent distribution, compliance heatmap

### Settings
- **GET** `/settings` - Get current application settings
- **POST** `/settings` - Update application settings

## 🛠️ Environment Configuration

### Backend (`.env`)
```env
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./data/insightmail.db
CORS_ORIGINS=http://localhost:5173
```

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🧪 Testing

The backend includes a mock mode that activates automatically when `GEMINI_API_KEY` is not set, allowing you to test the full application flow without an API key.

## 📊 Features Overview

### Email Analyzer
- Real-time email analysis with AI insights
- Tone selection for smart replies (formal, empathetic, friendly, assertive)
- Detailed emotion and intent detection
- Compliance and PII flagging
- Risk score with breakdown metrics

### Analytics Dashboard
- Sentiment trends over time (line chart)
- Intent distribution (bar chart)
- Compliance issue heatmap
- Overall statistics

### History Page
- Chronological list of all analyzed emails
- Preview of email content
- Risk scores and timestamps
- Quick access to past analyses

### Settings
- Toggle features on/off
- Configure API endpoints
- Customize application behavior

## 🐛 Troubleshooting

### Frontend npm install fails (ECONNRESET)
```bash
npm cache clean --force
npm set registry https://registry.npmjs.org/
npm set fetch-retries 5
npm install
```

### Backend Gemini API errors
- Verify your API key in `.env`
- Check the model name is `gemini-pro`
- Ensure `load_dotenv()` is called in `gemini_client.py`

### CORS errors
- Verify `CORS_ORIGINS` in backend `.env` matches your frontend URL
- Default frontend runs on `http://localhost:5173`

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

- Google Gemini AI for powerful language understanding
- Radix UI for accessible component primitives
- FastAPI for the excellent Python web framework
- React and Vite teams for modern web development tools

---

**Built with ❤️ using React, FastAPI, and Google Gemini AI**
