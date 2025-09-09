# --- Base image ---
FROM python:3.12-slim AS base

# Env để python log rõ ràng và không tạo file pyc
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Cài các package hệ thống cần cho psycopg2, numpy, networkx, pyvis, TensorFlow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    python3-dev \
    graphviz \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements trước để tận dụng cache
COPY requirements.txt .

# Cài dependencies production
RUN pip install -r requirements.txt

# Copy toàn bộ source code
COPY . .

# Expose cổng FastAPI
EXPOSE 8000

# Default CMD (production)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# --- Dev image (chỉ build khi cần) ---
FROM base AS dev

COPY requirements-dev.txt .
RUN pip install -r requirements-dev.txt


# uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload --log-level info