# InsightMail Backend - Complete Setup Script
# Run this script to set up everything automatically

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "InsightMail Backend - Automated Setup" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is installed
Write-Host "[1/7] Checking Ollama installation..." -ForegroundColor Yellow
try {
    $ollamaCheck = ollama list 2>&1
    Write-Host "  ✓ Ollama is installed" -ForegroundColor Green
    
    # Check for required models
    Write-Host "[2/7] Checking Ollama models..." -ForegroundColor Yellow
    $models = ollama list | Out-String
    
    if ($models -match "gemma:2b") {
        Write-Host "  ✓ gemma:2b found" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ gemma:2b not found. Installing..." -ForegroundColor Yellow
        ollama pull gemma:2b
        Write-Host "  ✓ gemma:2b installed" -ForegroundColor Green
    }
    
    if ($models -match "nomic-embed-text") {
        Write-Host "  ✓ nomic-embed-text found" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ nomic-embed-text not found. Installing..." -ForegroundColor Yellow
        ollama pull nomic-embed-text
        Write-Host "  ✓ nomic-embed-text installed" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Ollama is not installed!" -ForegroundColor Red
    Write-Host "  Please download from: https://ollama.ai" -ForegroundColor Red
    Write-Host "  After installing Ollama, run this script again." -ForegroundColor Red
    exit 1
}

# Check Python version
Write-Host "[3/7] Checking Python version..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($pythonVersion -match "Python 3\.([9]|[1-9][0-9])\.") {
    Write-Host "  ✓ $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Python 3.9+ required. Found: $pythonVersion" -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host "[4/7] Setting up virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "  ⚠ Virtual environment already exists" -ForegroundColor Yellow
} else {
    python -m venv venv
    Write-Host "  ✓ Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment and install dependencies
Write-Host "[5/7] Installing Python dependencies..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"
pip install -q -r requirements.txt
Write-Host "  ✓ Dependencies installed" -ForegroundColor Green

# Setup environment file
Write-Host "[6/7] Setting up environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "  ⚠ .env file already exists (skipping)" -ForegroundColor Yellow
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "  ✓ .env file created from template" -ForegroundColor Green
}

# Run prerequisites check
Write-Host "[7/7] Running final checks..." -ForegroundColor Yellow
python scripts/check_prerequisites.py

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. cd app" -ForegroundColor White
Write-Host "  2. python main.py" -ForegroundColor White
Write-Host ""
Write-Host "After backend starts:" -ForegroundColor Cyan
Write-Host "  - API: http://localhost:8000" -ForegroundColor White
Write-Host "  - Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "  - Run: python scripts/seed_knowledge_base.py (optional)" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
Write-Host ""
