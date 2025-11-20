# InsightMail Backend - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Ollama and Models

```powershell
# Download and install Ollama from https://ollama.ai

# Pull required models
ollama pull gemma:2b
ollama pull nomic-embed-text

# Verify installation
ollama list
```

### Step 2: Setup Python Environment

```powershell
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment

```powershell
# Copy environment template
copy .env.example .env

# The default settings work fine, no changes needed!
```

### Step 4: Run the Backend

```powershell
# Start the backend server
cd app
python main.py
```

The backend will start on http://localhost:8000

### Step 5: Seed Knowledge Base (Optional but Recommended)

Open a new PowerShell window:

```powershell
# Activate virtual environment
cd backend
venv\Scripts\activate

# Run seeding script
python scripts/seed_knowledge_base.py
```

This adds 7 sample policy documents for RAG-powered analysis.

### Step 6: Test the Backend

```powershell
# Run test script
python scripts/test_backend.py
```

## 🎯 Using with Frontend

Update your frontend's API configuration to point to:
```
http://localhost:8000/api
```

The backend provides these endpoints:
- `POST /api/analyze` - Analyze emails
- `GET /api/history` - Get analysis history
- `GET /api/analytics` - Get dashboard analytics
- `GET /api/settings` - Get settings
- `POST /api/settings` - Update settings
- `POST /api/kb/add` - Add knowledge base documents
- `GET /api/kb/list` - List knowledge base

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Troubleshooting

### Ollama Connection Error
```powershell
# Ensure Ollama is running
ollama serve
```

### Port Already in Use
```powershell
# Change port in main.py or use environment variable
$env:PORT=8001
python app/main.py
```

### Database Issues
```powershell
# Delete database and restart
del insightmail.db
python app/main.py
```

## 📊 Example Request

Test with PowerShell:

```powershell
$body = @{
    email = "URGENT: Customer data breach detected! Need immediate action."
    tone = "professional"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:8000/api/analyze" -Body $body -ContentType "application/json"
```

## 🎉 Next Steps

1. ✅ Backend running on port 8000
2. ✅ Knowledge base seeded with policies
3. ✅ Test API endpoints working
4. 🚀 Start your frontend application
5. 🎯 Test full integration

## 💡 Tips

- Keep Ollama running in the background
- First analysis takes 10-30 seconds (model loading)
- Subsequent analyses are faster
- Add more documents to knowledge base for better RAG results
- Monitor logs in the terminal for debugging

## 🆘 Need Help?

Check the full README.md for detailed documentation!
