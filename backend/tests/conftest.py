"""Test configuration: env defaults must be set before any app module imports."""

import os
import sys
from pathlib import Path

os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "opportunity_os_test")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")
os.environ.setdefault("RATE_LIMIT_IP_SALT", "test-salt")

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
