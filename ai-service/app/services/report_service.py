from fastapi import HTTPException
import numpy as np
from app.schemas.post import Post
from app.utils.prediction import violence_model_predict, hate_model_predict

# Violence detection mapping
violence_label_mapping = {
    0: "Non-Violence",
    1: "Violence"
}

# Hate speech detection mapping
hate_label_mapping = {
    0: "NotHate",
    1: "Racist",
    2: "Sexist", 
    3: "Homophobe",
    4: "Religion",
    5: "OtherHate"
}

def generate_violence_prediction(post: Post):
    # Lọc video
    filtered_media = [m for m in post.media if m.type != "VIDEO"]
    post.media = filtered_media

    try:
        violence_predictions = violence_model_predict(post)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during violence model prediction: {str(e)}")

    # Tạo danh sách predictions
    prediction_mapping = []
    for i, label in violence_label_mapping.items():
        prediction_mapping.append({
            "id": i,
            "label": label,
            "probability": round(float(violence_predictions[i]) * 100, 2),
        })
    
    # Sắp xếp theo probability giảm dần
    prediction_mapping.sort(key=lambda x: x["probability"], reverse=True)
    
    # Xác định label chính
    main_label_idx = np.argmax(violence_predictions)
    main_label = violence_label_mapping.get(main_label_idx, "Unknown")
    
    return {
        "postId": post.id,
        "content": post.content,
        "type": "post",
        "status": "pending",
        "mainLabel": main_label,
        "mainProbability": round(float(violence_predictions[main_label_idx]) * 100, 2),
        "predictions": prediction_mapping,
    }

def generate_hate_prediction(post: Post):
    # Lọc video
    filtered_media = [m for m in post.media if m.type != "VIDEO"]
    post.media = filtered_media

    try:
        hate_predictions = hate_model_predict(post)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during hate speech model prediction: {str(e)}")

    # Tạo danh sách predictions
    prediction_mapping = []
    for i, label in hate_label_mapping.items():
        prediction_mapping.append({
            "id": i,
            "label": label,
            "probability": round(float(hate_predictions[i]) * 100, 2),
        })
    
    # Sắp xếp theo probability giảm dần
    prediction_mapping.sort(key=lambda x: x["probability"], reverse=True)
    
    # Xác định label chính
    main_label_idx = np.argmax(hate_predictions)
    main_label = hate_label_mapping.get(main_label_idx, "Unknown")
    
    return {
        "postId": post.id,
        "content": post.content,
        "type": "post",
        "status": "pending",
        "mainLabel": main_label,
        "mainProbability": round(float(hate_predictions[main_label_idx]) * 100, 2),
        "predictions": prediction_mapping,
    }