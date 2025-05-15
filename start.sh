#!/bin/bash
# Start script for backend deployment

cd "$(dirname "$0")/backend"
uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}
