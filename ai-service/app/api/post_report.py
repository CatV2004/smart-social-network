from fastapi import APIRouter, Path, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_dbwh_session 
from app.schemas.post import Post
from app.db.queries.post_queries import GET_POST_BY_ID, map_post_with_media
from app.schemas.report import ReportResponse
from app.core.logger import logger
from app.services.report_service import generate_violence_prediction, generate_hate_prediction
router = APIRouter()

# API cho Violence Detection
@router.get("/post/violence-report/{post_id}", response_model=ReportResponse)
def violence_report_handling(
    post_id: str = Path(..., description="Post ID cần kiểm tra violence"),
    db: Session = Depends(get_dbwh_session)
):
    rows = db.execute(GET_POST_BY_ID, {"post_id": post_id}).fetchall()

    if not rows:
        raise HTTPException(status_code=404, detail="Post not found")

    post_schema: Post = map_post_with_media(rows)
    logger.info(f"Mapped Post Schema for violence detection: {post_schema.model_dump_json(indent=2)}")

    try:
        prediction_result = generate_violence_prediction(post_schema)
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error during violence prediction processing: {str(e)}"
        )

    return prediction_result

# API cho Multimodal Hate Speech Detection
@router.get("/post/hate-report/{post_id}", response_model=ReportResponse)
def hate_report_handling(
    post_id: str = Path(..., description="Post ID cần kiểm tra hate speech"),
    db: Session = Depends(get_dbwh_session)
):
    rows = db.execute(GET_POST_BY_ID, {"post_id": post_id}).fetchall()

    if not rows:
        raise HTTPException(status_code=404, detail="Post not found")

    post_schema: Post = map_post_with_media(rows)
    logger.info(f"Mapped Post Schema for hate speech detection: {post_schema.model_dump_json(indent=2)}")

    try:
        prediction_result = generate_hate_prediction(post_schema)
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error during hate speech prediction processing: {str(e)}"
        )

    return prediction_result