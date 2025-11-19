# InsightMail Backend API

FastAPI backend with Google Gemini integration for email analysis, providing sentiment detection, compliance flagging, risk scoring, and AI-generated smart replies.

## Features

- **Email Analysis**: AI-powered intent, emotion, urgency, and compliance detection
- **Smart Replies**: Context-aware reply generation with tone control (formal, empathetic, friendly, assertive)
- **Risk Scoring**: Multi-dimensional risk assessment with breakdown metrics
- **History Tracking**: SQLite-based persistence of all analyses
- **Analytics Dashboard**: Aggregated metrics for sentiment trends, intent distribution, and compliance
- **Settings Management**: Configurable API endpoints and feature toggles

## Tech Stack

- **Framework**: FastAPI (Python 3.10+)
- **LLM**: Google Gemini via `google-generativeai`
- **Database**: SQLite + SQLAlchemy ORM
- **Validation**: Pydantic v2

## Prerequisites

- Python 3.10 or higher
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Installation & Setup

### 1. Clone and navigate to backend

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and set your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

**Important**: If you don't have a Gemini API key, the backend will run in **mock mode** and return deterministic sample responses.

### 5. Run the server

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

- **Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc

## Frontend Integration

### Configure the React frontend

In your `Frontend/` directory, create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Then rebuild/restart your Vite dev server:

```bash
cd ../Frontend
npm run dev
```

The frontend will now communicate with the backend API.

## API Endpoints

### Analysis

- `POST /analyze` - Analyze an email and generate insights
  - Request: `{ "email": "string", "tone": "empathetic" }`
  - Response: Full analysis JSON (intent, emotion, risk, smart_reply, etc.)

### History

- `GET /history` - Retrieve past analyses (with optional filters)
- `POST /history` - Store an analysis record
- `GET /history/{id}` - Get a specific analysis by ID

### Dashboard

- `GET /dashboard` - Get aggregated analytics (sentiment trends, intent distribution, compliance metrics)

### Settings

- `GET /settings` - Retrieve current settings
- `POST /settings` - Update settings (API config, feature toggles)

## Project Structure

```
backend/
├── main.py                     # FastAPI app entry + CORS
├── requirements.txt
├── .env.example
├── README.md
├── data/
│   └── insightmail.db          # SQLite database (auto-created)
└── app/
    ├── api/
    │   ├── analyze.py          # /analyze endpoint
    │   ├── history.py          # /history endpoints
    │   ├── dashboard.py        # /dashboard endpoint
    │   └── settings.py         # /settings endpoints
    ├── db/
    │   ├── models.py           # SQLAlchemy models
    │   └── session.py          # Database session factory
    ├── lms/
    │   ├── prompts.py          # LLM prompt templates
    │   └── gemini_client.py    # Gemini API wrapper
    ├── services/
    │   ├── pipeline.py         # Analysis orchestration
    │   └── utils.py            # Helper functions
    └── schemas/
        └── analysis.py         # Pydantic request/response models
```

## Development

### Running tests (optional)

```bash
pytest tests/
```

### Mock Mode

If `GEMINI_API_KEY` is not set or invalid, the backend automatically runs in mock mode, returning sample deterministic responses. This is useful for:

- Local development without API costs
- Testing frontend integration
- CI/CD pipelines

### Database Management

The SQLite database is created automatically at `data/insightmail.db` on first run. To reset:

```bash
rm data/insightmail.db
# Restart the server to recreate
```

## Deployment

### Production checklist

1. Set `GEMINI_API_KEY` in production environment
2. Configure `CORS_ORIGINS` to include your frontend domain
3. Use a production ASGI server (e.g., `gunicorn` with `uvicorn` workers)
4. Consider migrating to PostgreSQL for production scale
5. Enable HTTPS and secure your API key storage

### Example production command

```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Troubleshooting

**Issue**: `ModuleNotFoundError: No module named 'google.generativeai'`
- **Fix**: Ensure you activated the virtual environment and ran `pip install -r requirements.txt`

**Issue**: API returns 500 errors with Gemini calls
- **Fix**: Check your `GEMINI_API_KEY` is valid. Test mock mode by unsetting the key.

**Issue**: CORS errors in browser
- **Fix**: Add your frontend origin to `CORS_ORIGINS` in `.env`

**Issue**: Database locked errors
- **Fix**: SQLite doesn't handle high concurrency well. For production, migrate to PostgreSQL.

## License

MIT

---

**Questions?** Check the [FastAPI docs](https://fastapi.tiangolo.com/) or [Gemini API docs](https://ai.google.dev/docs).
