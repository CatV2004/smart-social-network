import os
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Load environment variables từ .env file
load_dotenv()

class Settings(BaseSettings):
    # Database settings for existing data warehouse (READ-ONLY)
    DBWH_USERNAME: str = os.getenv("DBWH_USERNAME", "catv2004_wh")
    DBWH_PASSWORD: str = os.getenv("DBWH_PASSWORD", "admin@123_wh")
    DBWH_DATABASE: str = os.getenv("DBWH_DATABASE", "network_dbwh")
    DBWH_HOST: str = os.getenv("DBWH_HOST", "localhost")
    DBWH_PORT: int = int(os.getenv("DBWH_PORT", "5433"))

    # Local database for application (nếu cần cho caching/user sessions)
    LOCAL_DB_URL: Optional[str] = os.getenv("LOCAL_DB_URL", "sqlite:///./app.db")

    # AI Model settings - THÊM CHO GRAPH RECOMMENDATION
    MODEL_PATH: str = os.getenv("MODEL_PATH", "data/models")
    GRAPH_MODEL_NAME: str = os.getenv("GRAPH_MODEL_NAME", "graph_recommendation_model.pkl")
    BATCH_SIZE: int = int(os.getenv("BATCH_SIZE", "1000"))

    # Training settings - THÊM CHO MODEL TRAINING
    TRAINING_SAMPLE_SIZE: int = int(os.getenv("TRAINING_SAMPLE_SIZE", "10000"))
    TEST_SIZE: float = float(os.getenv("TEST_SIZE", "0.2"))
    RANDOM_STATE: int = int(os.getenv("RANDOM_STATE", "42"))

    # Feature settings - THÊM CHO GRAPH FEATURES
    MIN_SIMILARITY_THRESHOLD: float = float(os.getenv("MIN_SIMILARITY_THRESHOLD", "0.05"))

    # API settings
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Rabbit mq settings
    RABBITMQ_HOST: str = os.getenv("RABBITMQ_HOST", "localhost")
    RABBITMQ_PORT: int = int(os.getenv("RABBITMQ_PORT", "5672"))
    RABBITMQ_USER: str = os.getenv("RABBITMQ_USER","admin")
    RABBITMQ_PASS: str = os.getenv("RABBITMQ_PASS","123456")
    QUEUE_NAME: str = os.getenv("QUEUE_NAME","123456")
    
    # Database URL for read-only connection to data warehouse
    @property
    def DBWH_URL(self) -> str:
        return f"postgresql://{self.DBWH_USERNAME}:{quote_plus(self.DBWH_PASSWORD)}@{self.DBWH_HOST}:{self.DBWH_PORT}/{self.DBWH_DATABASE}"

    class Config:
        env_file = ".env"
        case_sensitive = False

# Tạo instance config
settings = Settings()
