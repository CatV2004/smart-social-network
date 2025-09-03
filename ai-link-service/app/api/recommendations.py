from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import logging
import traceback
from fastapi.responses import FileResponse

from app.core.database import get_db
from app.services.graph_heuristics import GraphHeuristicsService
from app.models.schemas.recommendation import RecommendationResponse
from app.services.visualize import visualize_graph_pyvis

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/recommendations/{user_id}", response_model=List[RecommendationResponse])
def get_recommendations(
    user_id: str,
    algorithm: str = Query(
        "graph_heuristics",
        description="Algorithm to use: graph_heuristics, common_neighbors, jaccard, friend_of_friends"
    ),
    top_n: int = Query(10, ge=1, le=50, description="Number of recommendations to return"),
    db: Session = Depends(get_db)
):
    """Get recommendations for a user using different algorithms"""
    
    try:
        service = GraphHeuristicsService(db)
        
        if algorithm == "graph_heuristics":
            recommendations = service.generate_recommendations(user_id, top_n)
        
        elif algorithm == "common_neighbors":
            recommendations = service.get_common_neighbors_recommendations(user_id, top_n)
        
        elif algorithm == "friend_of_friends":
            recommendations = service.get_friend_of_friends_recommendations(user_id, top_n)
        
        elif algorithm == "jaccard":
            recommendations = service.get_jaccard_recommendations(user_id, top_n)
        
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid algorithm specified. Choose from: graph_heuristics, common_neighbors, jaccard, friend_of_friends"
            )
        
        # Bổ sung field mặc định nếu thiếu
        for rec in recommendations:
            rec.setdefault("similarity_score", rec.get("score", 0))
            rec.setdefault("final_score", rec.get("score", 0))
            rec.setdefault("common_features", {})
            rec.setdefault("reason_text", None)
        
        if not recommendations:
            raise HTTPException(status_code=404, detail="No recommendations found")
        
        return recommendations
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    

@router.get("/recommendations/{user_id}/algorithms")
def get_available_algorithms():
    """Get list of available recommendation algorithms"""
    return {
        "algorithms": [
            {"id": "graph_heuristics", "name": "Graph Heuristics", "description": "Combined heuristic scores"},
            {"id": "common_neighbors", "name": "Common Neighbors", "description": "Based on shared connections"},
            {"id": "friend_of_friends", "name": "Friend of Friends", "description": "Based on A->B->C 2-hop connections"},
            {"id": "jaccard", "name": "Jaccard Coefficient", "description": "Similarity based on neighbor overlap"}
        ]
    }
    

@router.get("/graph/visualize")
def visualize_graph(db: Session = Depends(get_db)):
    service = GraphHeuristicsService(db)
    graph = service.build_graph_from_database(force_rebuild=True)
    output_file = "social_graph.html"
    visualize_graph_pyvis(graph, output_file)
    return FileResponse(output_file, media_type="text/html")
