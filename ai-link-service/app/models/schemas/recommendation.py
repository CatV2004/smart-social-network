from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class RecommendationResponse(BaseModel):
    user_id: str = Field(..., description="Unique user identifier")
    username: str = Field(..., description="User's username")
    avatar: str = Field(..., description="User's avatar")
    first_name: str = Field(..., description="User's first name")
    last_name: str = Field(..., description="User's last name")
    similarity_score: float = Field(..., ge=0, le=1, description="Similarity score (0-1)")
    final_score: float = Field(..., ge=0, le=1, description="Final recommendation score (0-1)")
    location: Optional[str] = Field(None, description="User's location")
    bio: Optional[str] = Field(None, description="User's bio")
    followers_count: int = Field(0, description="Number of followers")
    following_count: int = Field(0, description="Number of following")
    posts_count: int = Field(0, description="Number of posts")
    common_features: Dict[str, Any] = Field(..., description="Detailed heuristic scores")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "user_id": "12345",
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "similarity_score": 0.85,
                "final_score": 0.82,
                "location": "New York, USA",
                "bio": "Software developer",
                "followers_count": 150,
                "following_count": 200,
                "posts_count": 45,
                "common_features": {
                    "common_neighbors": 15,
                    "jaccard_coefficient": 0.3
                }
            }
        }

class AlgorithmInfo(BaseModel):
    id: str = Field(..., description="Algorithm identifier")
    name: str = Field(..., description="Algorithm name")
    description: str = Field(..., description="Algorithm description")

class AlgorithmsResponse(BaseModel):
    algorithms: List[AlgorithmInfo]