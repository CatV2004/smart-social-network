from typing import List
from pydantic import BaseModel


class Media(BaseModel):
    id: str
    type: str 
    url: str


class Post(BaseModel):
    id: str
    content: str
    media: List[Media] = []


