from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from collections.abc import Generator

# Engine for data warehouse (read-only connection - CHO TRAINING VÀ INFERENCE)
dbwh_engine = create_engine(
    settings.DBWH_URL,
    pool_size=20,  # Tăng pool size cho heavy queries
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600,  # Recycle connections every hour
    echo=settings.DEBUG  # Log SQL queries trong debug mode
)

# Engine for local application database (nếu cần)
if settings.LOCAL_DB_URL:
    local_engine = create_engine(
        settings.LOCAL_DB_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        echo=settings.DEBUG
    )
else:
    local_engine = None

# Session makers
DBWhSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=dbwh_engine)

if local_engine:
    LocalSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=local_engine)
else:
    LocalSessionLocal = None

# Base cho models (nếu cần local models)
Base = declarative_base()

def get_dbwh_session() -> Generator[Session, None, None]:
    """Dependency for getting data warehouse session (READ-ONLY)"""
    db = DBWhSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_local_session() -> Generator[Session, None, None]:
    """Dependency for getting local application session"""
    if not LocalSessionLocal:
        raise RuntimeError("Local database not configured")
    
    db = LocalSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Alias cho compatibility
get_db = get_dbwh_session
engine = dbwh_engine