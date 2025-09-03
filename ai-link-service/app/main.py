from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import uvicorn

from app.core.config import Settings
from app.core.database import get_db, engine, Base
from app.api import recommendations
import logging

logging.basicConfig(
    level=logging.INFO,  
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
# Tạo tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Social Network Recommendation API",
    description="API for user recommendations using AI and graph algorithms",
    version="1.0.0"
)

# Include routers
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])

@app.get("/")
def root():
    return {"message": "Social Network Recommendation API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)