# InsightMail Backend API

FastAPI backend with Google Gemini AI integration for intelligent email analysis. Provides sentiment detection, compliance flagging, risk scoring, PII detection, and AI-generated smart replies with SQLite persistence.

## 🌟 Features

### Core Capabilities
- **AI-Powered Email Analysis**: Multi-dimensional email analysis using Google Gemini
  - Intent detection (action_required, informational, promotional, etc.)
  - Emotion recognition (positive, negative, neutral, mixed)
  - Urgency assessment (critical, high, medium, low)
  - Compliance flagging (legal, regulatory, ethical issues)
  
- **Smart Reply Generation**: Context-aware response suggestions
  - Multiple tone options: formal, empathetic, friendly, assertive
  - Maintains conversation context
  - Professional and natural language output

- **Risk Assessment**: Comprehensive risk scoring system
  - Overall risk score (0-100)
  - Detailed breakdown: compliance, urgency, pii, tone, anomaly scores
  - Risk category classification

- **PII Detection**: Identifies personally identifiable information
  - Email addresses, phone numbers, SSNs
  - Addresses, credit card numbers
  - Flagging and masking capabilities

- **Analytics Dashboard**: Aggregated metrics and trends
  - Sentiment trends over time
  - Intent distribution analysis
  - Compliance issue heatmaps

- **History Management**: Persistent storage of all analyses
  - SQLite database with SQLAlchemy ORM
  - Full analysis record retrieval
  - Timestamp tracking

- **Mock Mode**: Development-friendly fallback
  - Works without Gemini API key
  - Deterministic sample responses
  - Full endpoint functionality

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.104.1
- **AI Model**: Google Gemini API (`gemini-pro` model)
- **Database**: SQLite with SQLAlchemy 2.0.23 ORM
- **Validation**: Pydantic v2.5.0
- **Server**: Uvicorn (ASGI server)
- **Environment**: python-dotenv for configuration
- **Dependencies**: See `requirements.txt`

## 📋 Prerequisites

- **Python** 3.10 or higher
- **pip** (Python package manager)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))
  - Optional for development (mock mode available)

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

## 🔌 API Endpoints

### POST `/analyze`
Analyze an email and generate comprehensive insights.

**Request Body:**
```json
{
  "email": "Email content here...",
  "tone": "empathetic"  // Optional: formal, empathetic, friendly, assertive
}
```

**Response:**
```json
{
  "intent": "action_required",
  "emotion": "positive",
  "urgency": "high",
  "compliance_issues": ["potential_gdpr_concern"],
  "pii_detected": ["email@example.com"],
  "risk_score": 42,
  "risk_breakdown": {
    "compliance": 30,
    "urgency": 60,
    "pii": 40,
    "tone": 20,
    "anomaly": 15
  },
  "smart_reply": "Thank you for reaching out...",
  "analysis_summary": "This email requires immediate attention..."
}
```

### GET `/history`
Retrieve past email analyses.

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 50)

**Response:**
```json
[
  {
    "id": 1,
    "email_text": "Original email content...",
    "intent": "informational",
    "emotion": "neutral",
    "risk_score": 25,
    "created_at": "2025-11-20T10:30:00"
  }
]
```

### POST `/history`
Store a new analysis record.

**Request Body:**
```json
{
  "email_text": "Email content...",
  "intent": "action_required",
  "emotion": "positive",
  "urgency": "high",
  "compliance_issues": [],
  "pii_detected": [],
  "risk_score": 30,
  "smart_reply": "Generated reply..."
}
```

### GET `/dashboard`
Get aggregated analytics and metrics.

**Response:**
```json
{
  "total_analyzed": 150,
  "avg_risk_score": 35.7,
  "sentiment_trend": [
    {"date": "2025-11-15", "positive": 45, "negative": 10, "neutral": 20},
    {"date": "2025-11-16", "positive": 50, "negative": 8, "neutral": 22}
  ],
  "intent_distribution": {
    "action_required": 60,
    "informational": 45,
    "promotional": 30,
    "support_request": 15
  },
  "compliance_heatmap": [
    {"category": "gdpr", "count": 12},
    {"category": "legal", "count": 5}
  ]
}
```

### GET `/settings`
Retrieve current application settings.

**Response:**
```json
{
  "enable_pii_detection": true,
  "enable_compliance_check": true,
  "enable_smart_reply": true,
  "default_reply_tone": "empathetic",
  "risk_threshold": 70
}
```

### POST `/settings`
Update application settings.

**Request Body:**
```json
{
  "enable_pii_detection": true,
  "enable_compliance_check": false,
  "default_reply_tone": "formal",
  "risk_threshold": 80
}
```

## 📁 Project Structure

```
backend/
├── main.py                          # FastAPI application entry point
│                                    # - CORS middleware configuration
│                                    # - Router registration
│                                    # - Database initialization
│
├── requirements.txt                 # Python dependencies
├── .env.example                     # Environment variable template
├── README.md                        # This file
│
├── data/
│   └── insightmail.db              # SQLite database (auto-created)
│
└── app/
    ├── api/                         # API route handlers
    │   ├── analyze.py              # POST /analyze - Email analysis
    │   ├── history.py              # GET/POST /history - Analysis records
    │   ├── dashboard.py            # GET /dashboard - Analytics metrics
    │   └── settings.py             # GET/POST /settings - App configuration
    │
    ├── db/                          # Database layer
    │   ├── models.py               # SQLAlchemy ORM models
    │   │                           # - AnalysisRecord (email analyses)
    │   │                           # - Settings (app configuration)
    │   └── session.py              # Database session factory & init
    │
    ├── lms/                         # LLM integration layer
    │   ├── prompts.py              # Prompt templates for Gemini
    │   │                           # - Intent, emotion, urgency prompts
    │   │                           # - Compliance, PII detection
    │   │                           # - Smart reply generation
    │   └── gemini_client.py        # Gemini API wrapper
    │                               # - JSON response parsing
    │                               # - Mock mode fallback
    │
    ├── services/                    # Business logic layer
    │   ├── pipeline.py             # Analysis orchestration
    │   │                           # - Multi-step LLM pipeline
    │   │                           # - Risk score calculation
    │   │                           # - Result aggregation
    │   └── utils.py                # Helper utilities
    │                               # - Text cleaning
    │                               # - PII masking
    │                               # - JSON parsing
    │
    └── schemas/                     # Pydantic models
        └── analysis.py             # Request/response schemas
                                    # - AnalyzeRequest
                                    # - AnalyzeResponse
                                    # - HistoryRecord
                                    # - DashboardMetrics
```

## 🔄 How It Works

### Email Analysis Pipeline

1. **Request Processing** (`api/analyze.py`)
   - Receives email content and optional tone parameter
   - Validates input with Pydantic schemas

2. **Analysis Orchestration** (`services/pipeline.py`)
   - Runs 7 sequential Gemini API calls:
     1. Intent detection
     2. Emotion analysis
     3. Urgency assessment
     4. Compliance checking
     5. PII detection
     6. Smart reply generation
     7. Analysis summary

3. **Risk Scoring** (`services/pipeline.py`)
   - Calculates weighted risk score (0-100)
   - Provides detailed breakdown:
     - Compliance risk: 30%
     - Urgency risk: 25%
     - PII risk: 20%
     - Tone risk: 15%
     - Anomaly detection: 10%

4. **Persistence** (`db/models.py`)
   - Stores complete analysis in SQLite
   - Tracks timestamp for history

5. **Response** (`schemas/analysis.py`)
   - Returns structured JSON response
   - Includes all analysis dimensions

### Mock Mode

When `GEMINI_API_KEY` is not configured:
- `gemini_client.py` automatically switches to mock mode
- Returns deterministic sample responses
- All endpoints remain functional
- Useful for development and testing

## 🧪 Development

### Running in Development Mode

```bash
# With auto-reload on code changes
uvicorn main:app --reload --port 8000

# With custom host
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Testing with Swagger UI

1. Navigate to `http://localhost:8000/docs`
2. Click "Try it out" on any endpoint
3. Fill in request body
4. Execute and view response

### Database Management

**View database:**
```bash
sqlite3 data/insightmail.db
sqlite> .tables
sqlite> SELECT * FROM analysis_records LIMIT 5;
sqlite> .exit
```

**Reset database:**
```bash
rm data/insightmail.db
# Restart server to recreate with fresh schema
```

**Backup database:**
```bash
cp data/insightmail.db data/backup_$(date +%Y%m%d).db
```

## 🚀 Frontend Integration

### Configure React Frontend

In your `Frontend/` directory, create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the frontend:

```bash
cd ../Frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and will communicate with the backend API.

### CORS Configuration

The backend is pre-configured for frontend CORS:

```python
# main.py
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative port
]
```

For production, update `CORS_ORIGINS` in `.env`:

```env
CORS_ORIGINS=https://your-frontend-domain.com
```

## 🚢 Deployment

### Production Checklist

- [ ] Set strong `GEMINI_API_KEY` in production environment
- [ ] Configure production database URL (or keep SQLite for small-scale)
- [ ] Update `CORS_ORIGINS` to your frontend domain
- [ ] Set `DEBUG=False` if using custom debug flags
- [ ] Use production ASGI server (gunicorn + uvicorn workers)
- [ ] Enable HTTPS/TLS for API endpoints
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting for API endpoints
- [ ] Review and secure sensitive data handling

### Production Server Setup

**Using Gunicorn with Uvicorn workers:**

```bash
pip install gunicorn

gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

**Using Docker:**

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Environment Variables for Production:**

```env
GEMINI_API_KEY=your_production_api_key
DATABASE_URL=sqlite:///./data/insightmail.db  # or PostgreSQL URL
CORS_ORIGINS=https://your-frontend.com,https://www.your-frontend.com
```

### Scaling Considerations

**SQLite Limitations:**
- Good for small-to-medium scale (< 100k requests/day)
- Single-writer limitation
- File-based storage

**Migrate to PostgreSQL for production:**

```bash
pip install psycopg2-binary

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/insightmail
```

**Caching:**
- Consider Redis for frequently accessed data
- Cache dashboard metrics
- Rate limiting with Redis

**Load Balancing:**
- Use nginx or cloud load balancer
- Multiple uvicorn workers
- Horizontal scaling with containerization

## 🐛 Troubleshooting

### Gemini API Issues

**Error: `404 models/gemini-1.5-flash is not found`**
- **Solution**: Use `gemini-pro` model name (already configured)
- Check API version compatibility

**Error: `GEMINI_API_KEY not found`**
- **Solution**: Ensure `.env` file exists with valid API key
- Verify `load_dotenv()` is called in `gemini_client.py`

**Error: Rate limiting / quota exceeded**
- **Solution**: Implement request throttling
- Consider upgrading API plan
- Use mock mode for development

### Database Issues

**Error: `no such table: analysis_records`**
- **Solution**: Delete `data/insightmail.db` and restart server
- Database will be recreated with correct schema

**Error: Database locked**
- **Cause**: SQLite doesn't handle concurrent writes well
- **Solution**: 
  - Use connection pooling carefully
  - Consider PostgreSQL for high concurrency
  - Implement retry logic

### CORS Issues

**Error: `CORS policy: No 'Access-Control-Allow-Origin' header`**
- **Solution**: Add frontend URL to `CORS_ORIGINS` in `.env`
- Restart backend after changing environment variables

### Performance Issues

**Slow response times**
- **Check**: Gemini API latency (7 sequential calls)
- **Solution**: Implement request caching
- **Solution**: Use async processing for non-critical analysis steps
- **Consider**: Batch processing for multiple emails

### Import Errors

**Error: `ModuleNotFoundError: No module named 'app'`**
- **Solution**: Run `uvicorn main:app` from backend directory
- **Solution**: Ensure virtual environment is activated

**Error: `ImportError: cannot import name 'load_dotenv'`**
- **Solution**: `pip install python-dotenv`

## 📊 API Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created (POST /history) |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error (Pydantic) |
| 500 | Internal Server Error | Server-side error |

## 🔒 Security Considerations

### Data Privacy
- PII is detected but not automatically redacted in storage
- Consider implementing PII masking before database persistence
- Review data retention policies

### API Key Security
- Never commit `.env` file to version control
- Use environment variables in production
- Rotate API keys periodically

### Input Validation
- All inputs validated with Pydantic schemas
- SQL injection prevented by SQLAlchemy ORM
- Consider rate limiting on analysis endpoint

### CORS
- Restrict `CORS_ORIGINS` to trusted domains only
- Don't use `*` wildcard in production

## 📖 Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Google Gemini API**: https://ai.google.dev/docs
- **SQLAlchemy ORM**: https://docs.sqlalchemy.org/
- **Pydantic**: https://docs.pydantic.dev/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (including mock mode)
5. Commit with descriptive messages
6. Push to your branch
7. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 💬 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section above

## 🔗 Related Documentation

- [Frontend README](../Frontend/README.md) - React frontend setup
- [Main README](../README.md) - Full project overview
- [INTEGRATION.md](./INTEGRATION.md) - Detailed integration guide

---

**Built with FastAPI, Google Gemini AI, and SQLAlchemy**

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
