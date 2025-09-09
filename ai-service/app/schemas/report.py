from typing import List
from pydantic import BaseModel

class PredictionResult(BaseModel):
    id: int
    label: str
    probability: float

class ReportResponse(BaseModel):
    postId: str
    content: str
    type: str
    status: str
    mainLabel: str
    mainProbability: float
    predictions: List[PredictionResult]