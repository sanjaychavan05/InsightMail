# 🎯 InsightMail Backend - Installation & Running Guide

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Python 3.9 or higher**
   ```powershell
   python --version
   # Should show Python 3.9.x or higher
   ```

2. **Ollama installed**
   - Download from: https://ollama.ai
   - Install and ensure it's running

## 🚀 Installation Steps

### Option 1: Automated Setup (Recommended)

```powershell
cd backend
.\setup.ps1
```

This script will:
- ✅ Check Ollama installation
- ✅ Download required models (gemma:2b, nomic-embed-text)
- ✅ Create virtual environment
- ✅ Install all Python dependencies
- ✅ Create .env configuration file
- ✅ Run prerequisites check

### Option 2: Manual Setup

#### Step 1: Install Ollama Models

```powershell
# Download LLM model (about 1.7 GB)
ollama pull gemma:2b

# Download embedding model (about 274 MB)
ollama pull nomic-embed-text

# Verify models are installed
ollama list
```

#### Step 2: Setup Python Environment

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Step 3: Configure Environment

```powershell
# Copy environment template
copy .env.example .env

# The default settings work perfectly, no changes needed!
```

## ▶️ Running the Backend

### Start the Server

```powershell
# Make sure you're in the backend directory
cd backend

# Activate virtual environment (if not already activated)
venv\Scripts\activate

# Navigate to app directory
cd app

# Start the FastAPI server
python main.py
```

You should see output like:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

The backend is now running! 🎉

## 🌐 Accessing the Backend

Once running, you can access:

- **API Base URL**: http://localhost:8000/api
- **Swagger UI (Interactive Docs)**: http://localhost:8000/docs
- **ReDoc (Alternative Docs)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📊 Seeding the Knowledge Base (Recommended)

Open a **new** PowerShell window:

```powershell
# Navigate to backend
cd backend

# Activate virtual environment
venv\Scripts\activate

# Run seeding script
python scripts\seed_knowledge_base.py
```

This adds 7 professional policy documents to enhance RAG-powered analysis.

## 🧪 Testing the Backend

### Run Automated Tests

```powershell
# In backend directory with venv activated
python scripts\test_backend.py
```

This tests all endpoints to ensure everything works.

### Manual Test with PowerShell

```powershell
# Test email analysis
$body = @{
    email = "URGENT: We have a critical security issue that needs immediate attention!"
    tone = "professional"
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post `
    -Uri "http://localhost:8000/api/analyze" `
    -Body $body `
    -ContentType "application/json"

$response | ConvertTo-Json -Depth 10
```

### Test with Browser

Navigate to http://localhost:8000/docs and use the interactive Swagger UI to test endpoints.

## 🔧 Common Issues & Solutions

### Issue: "Ollama connection refused"

**Solution:**
```powershell
# Ensure Ollama is running
ollama serve

# In another window, verify it's working
ollama list
```

### Issue: "Model not found"

**Solution:**
```powershell
# Pull the required models
ollama pull gemma:2b
ollama pull nomic-embed-text
```

### Issue: "Port 8000 already in use"

**Solution:**
```powershell
# Option 1: Find and kill the process using port 8000
netstat -ano | findstr :8000
taskkill /F /PID <PID_NUMBER>

# Option 2: Change the port in main.py
# Edit app/main.py and change port to 8001 or another available port
```

### Issue: "ModuleNotFoundError"

**Solution:**
```powershell
# Ensure virtual environment is activated
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "Database locked"

**Solution:**
```powershell
# Stop the backend
# Delete the database file
del insightmail.db
# Restart the backend (it will recreate the database)
```

## 📱 Connecting Your Frontend

In your frontend project, update the API base URL:

**frontend/src/services/api.ts:**
```typescript
const API_BASE_URL = "http://localhost:8000/api";
```

Or in your .env file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🛑 Stopping the Backend

Press `Ctrl+C` in the terminal where the backend is running.

## 🔄 Restarting the Backend

```powershell
# If virtual environment is not activated
cd backend
venv\Scripts\activate

# Start the server
cd app
python main.py
```

## 📈 Monitoring

### View Logs

The backend prints detailed logs to the console. Watch for:
- `INFO` - Normal operations
- `WARNING` - Non-critical issues
- `ERROR` - Problems that need attention

### Check Database

```powershell
# Install SQLite browser (optional)
# Download from: https://sqlitebrowser.org

# Or use Python to query
python
>>> from sqlalchemy import create_engine
>>> engine = create_engine('sqlite:///insightmail.db')
>>> # Run queries here
```

## 💾 Data Storage

- **Database**: `backend/insightmail.db` (SQLite file)
- **Logs**: Console output
- **Configuration**: `backend/.env`

## 🔐 Security Notes

For production deployment:

1. Change `SECRET_KEY` in `.env`
2. Use PostgreSQL instead of SQLite
3. Enable HTTPS
4. Configure proper CORS origins
5. Add authentication/authorization
6. Use environment-specific configs

## 🎓 Learning Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Ollama Docs**: https://ollama.ai/docs
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org

## ✅ Health Checklist

Before using the backend, verify:

- [x] Ollama is running (`ollama list` works)
- [x] Models are installed (gemma:2b, nomic-embed-text)
- [x] Virtual environment is activated
- [x] Dependencies are installed
- [x] Backend starts without errors
- [x] Can access http://localhost:8000/docs
- [x] Health check returns success
- [x] Knowledge base is seeded (optional)

## 🎉 You're Ready!

Once all checks pass, your backend is fully operational and ready to serve your frontend!

Visit http://localhost:8000/docs to explore the API interactively.

---

**Need Help?** Check README.md for detailed documentation!
