"""
Script to check if all prerequisites are met before running the backend
"""
import sys
import subprocess
import os
from pathlib import Path


def check_python_version():
    """Check if Python version is 3.9+"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 9:
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} (OK)")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor}.{version.micro} (Need 3.9+)")
        return False


def check_ollama():
    """Check if Ollama is installed and running"""
    try:
        result = subprocess.run(
            ["ollama", "list"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            print("✓ Ollama is installed and running")
            
            # Check for required models
            output = result.stdout.lower()
            has_gemma = "gemma:2b" in output or "gemma" in output
            has_nomic = "nomic-embed-text" in output
            
            if has_gemma:
                print("  ✓ gemma:2b model found")
            else:
                print("  ✗ gemma:2b model NOT found - Run: ollama pull gemma:2b")
            
            if has_nomic:
                print("  ✓ nomic-embed-text model found")
            else:
                print("  ✗ nomic-embed-text model NOT found - Run: ollama pull nomic-embed-text")
            
            return has_gemma and has_nomic
        else:
            print("✗ Ollama is not running")
            return False
    except FileNotFoundError:
        print("✗ Ollama is not installed")
        print("  Download from: https://ollama.ai")
        return False
    except subprocess.TimeoutExpired:
        print("✗ Ollama command timed out")
        return False
    except Exception as e:
        print(f"✗ Error checking Ollama: {str(e)}")
        return False


def check_virtual_env():
    """Check if virtual environment is activated"""
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("✓ Virtual environment is activated")
        return True
    else:
        print("⚠ Virtual environment is NOT activated")
        print("  Run: venv\\Scripts\\activate (Windows) or source venv/bin/activate (Linux/Mac)")
        return False


def check_dependencies():
    """Check if required Python packages are installed"""
    required_packages = [
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "pydantic",
        "httpx",
        "numpy"
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)
    
    if not missing:
        print(f"✓ All {len(required_packages)} required packages installed")
        return True
    else:
        print(f"✗ Missing packages: {', '.join(missing)}")
        print("  Run: pip install -r requirements.txt")
        return False


def check_env_file():
    """Check if .env file exists"""
    env_path = Path(".env")
    if env_path.exists():
        print("✓ .env file found")
        return True
    else:
        print("⚠ .env file not found (will use defaults)")
        print("  Optional: copy .env.example .env")
        return True  # Not critical


def main():
    """Run all checks"""
    print("=" * 70)
    print("InsightMail Backend - Prerequisites Check")
    print("=" * 70)
    print()
    
    checks = [
        ("Python Version", check_python_version()),
        ("Ollama & Models", check_ollama()),
        ("Virtual Environment", check_virtual_env()),
        ("Python Dependencies", check_dependencies()),
        ("Environment File", check_env_file()),
    ]
    
    print()
    print("=" * 70)
    print("Summary")
    print("=" * 70)
    
    all_passed = all(result for _, result in checks)
    
    for name, result in checks:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {name}")
    
    print()
    
    if all_passed:
        print("✅ All checks passed! You're ready to run the backend.")
        print()
        print("Next steps:")
        print("  1. cd app")
        print("  2. python main.py")
        print()
    else:
        print("⚠ Some checks failed. Please fix the issues above before running.")
        print()
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
