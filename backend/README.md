# InsightMail Backend

Complete FastAPI backend for InsightMail - AI-powered email analysis with RAG integration.

## Features

✨ **Email Analysis Pipeline**
- Intent detection
- Emotion analysis with reasoning
- Urgency classification
- Compliance flag detection
- Summary generation
- Action item extraction
- Risk scoring across multiple dimensions
- Smart reply generation with tone control

🔍 **RAG (Retrieval-Augmented Generation)**
- Vector similarity search using Ollama embeddings
- Knowledge base for policies, FAQs, guidelines
- Context-aware analysis using company knowledge

🤖 **LLM Integration**
- Ollama integration (gemma:2b model)
- Nomic-embed-text for embeddings
- Optimized prompts for enterprise email analysis

📊 **Analytics Dashboard**
- Sentiment trends over time
- Intent distribution
- Compliance tracking
- Urgency analysis
- Risk metrics

⚙️ **Settings Management**
- Configurable RAG parameters
- Feature toggles
- API configuration

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── core/
│   │   └── config.py        # Configuration settings
│   ├── db/
│   │   ├── models.py        # SQLAlchemy models
│   │   └── session.py       # Database session management
│   ├── schemas/
│   │   └── __init__.py      # Pydantic schemas
│   ├── services/
│   │   ├── llm_service.py   # Ollama LLM integration
│   │   ├── rag_service.py   # RAG functionality
│   │   └── pipeline.py      # Email analysis pipeline
│   └── routers/
│       ├── analyze.py       # Email analysis endpoint
│       ├── history.py       # History retrieval
│       ├── analytics.py     # Analytics dashboard
│       ├── settings.py      # Settings management
│       └── knowledge_base.py # RAG knowledge base
├── sample_data/             # Sample RAG documents
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Prerequisites

1. **Python 3.9+**
2. **Ollama** installed and running
   - Download from: https://ollama.ai
3. **Required Ollama Models**:
   ```bash
   ollama pull gemma:2b
   ollama pull nomic-embed-text
   ```

## Installation

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings (optional, defaults work fine)
```

### 5. Initialize Database

The database will be automatically created on first run.

## Running the Backend

### Development Mode

```bash
# From the backend directory
cd app
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or simply:

```bash
python app/main.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc

### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Email Analysis

**POST** `/api/analyze`

Analyze email content with AI.

```json
{
  "email": "Your email content here...",
  "tone": "professional"
}
```

Response includes: intent, emotion, urgency, compliance flags, summary, action items, risk score, smart reply, and RAG context.

### History

**GET** `/api/history?limit=50&offset=0`

Retrieve past email analyses.

### Analytics

**GET** `/api/analytics?days=30`

Get dashboard analytics including sentiment trends, intent distribution, compliance trends, and urgency over time.

### Settings

**GET** `/api/settings`

Get current settings.

**POST** `/api/settings`

Update settings.

```json
{
  "enable_rag": true,
  "enable_compliance_check": true,
  "enable_risk_scoring": true,
  "enable_smart_reply": true,
  "rag_top_k": 3,
  "default_tone": "professional"
}
```

### Knowledge Base

**POST** `/api/kb/add`

Add document to knowledge base.

```json
{
  "title": "Email Communication Policy",
  "content": "Full document content...",
  "document_type": "policy",
  "source": "HR Department"
}
```

**GET** `/api/kb/list`

List all knowledge base documents.

**DELETE** `/api/kb/{document_id}`

Delete a knowledge base document.

## Seeding Knowledge Base

To populate the knowledge base with sample documents:

```bash
# From the backend directory
python scripts/seed_knowledge_base.py
```

This will add sample policies and FAQs to improve RAG-powered analysis.

## Configuration

### Environment Variables

Edit `.env` file:

```env
# Database
DATABASE_URL=sqlite:///./insightmail.db

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma:2b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
OLLAMA_TIMEOUT=120

# RAG
RAG_TOP_K=3
RAG_SIMILARITY_THRESHOLD=0.5

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Using PostgreSQL (Optional)

To use PostgreSQL instead of SQLite:

1. Install PostgreSQL driver:
```bash
pip install psycopg2-binary
```

2. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://username:password@localhost/insightmail
```

## Testing

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

# Add to knowledge base
curl -X POST http://localhost:8000/api/kb/add \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Policy", "content": "This is a test policy document.", "document_type": "policy"}'
```

### Test with Swagger UI

Navigate to http://localhost:8000/docs for interactive API documentation.

## Troubleshooting

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

### Database Issues

```bash
# Delete and recreate database
rm insightmail.db
# Restart the application to recreate
```

### CORS Errors

Add your frontend URL to `CORS_ORIGINS` in `.env`:

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://yourdomain.com
```

## Performance Tips

1. **RAG Optimization**: Adjust `RAG_TOP_K` and `RAG_SIMILARITY_THRESHOLD` in settings
2. **Model Selection**: Use `gemma:2b` for speed or `llama2:7b` for accuracy
3. **Database**: Use PostgreSQL for production workloads
4. **Caching**: Consider adding Redis for frequently accessed data

## Production Deployment

### Using Docker (Recommended)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using systemd

```bash
# Create service file at /etc/systemd/system/insightmail.service
[Unit]
Description=InsightMail Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

## Architecture

### LLM Pipeline Flow

1. **RAG Context Retrieval**: Query embeddings → Vector search → Top-K relevant docs
2. **Intent Detection**: LLM analyzes with RAG context
3. **Emotion Analysis**: LLM identifies emotion + reasoning
4. **Urgency Classification**: LLM determines priority level
5. **Compliance Check**: LLM flags policy violations
6. **Summary Generation**: LLM creates concise summary
7. **Action Items**: LLM extracts actionable tasks
8. **Risk Scoring**: LLM assesses multiple risk dimensions
9. **Smart Reply**: LLM generates contextual response
10. **Database Storage**: Save complete analysis

### RAG Implementation

- **Embedding Model**: nomic-embed-text (768 dimensions)
- **Similarity Metric**: Cosine similarity
- **Vector Storage**: JSON field in SQLite/PostgreSQL
- **Retrieval**: Top-K most relevant documents above threshold

## API Response Times

Typical response times (on M1 Mac):
- Email Analysis: 10-30 seconds (depends on LLM model)
- History Retrieval: <100ms
- Analytics Generation: 100-500ms
- Settings Operations: <50ms
- Knowledge Base Operations: 100-300ms

## License

MIT

## Support

For issues or questions:
1. Check `/docs` endpoint for API documentation
2. Review logs in console output
3. Verify Ollama is running with correct models
4. Check database connectivity

## Contributing

Contributions welcome! Areas for improvement:
- Additional LLM model support
- Enhanced prompt engineering
- Advanced analytics visualizations
- Performance optimizations
- Additional RAG strategies

---

**Built with FastAPI, Ollama, and SQLAlchemy**
