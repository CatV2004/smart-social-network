import numpy as np
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing.sequence import pad_sequences
from app.utils.preprocess import preprocess_text, preprocess_image_violence, preprocess_image_hate
from app.core.model_loader import multimodal_model, tokenizer, violence_model
from app.schemas.post import Post

def violence_model_predict(post: Post) -> np.ndarray:
    """Dự đoán violence với model 128x128"""
    violence_predictions = []

    for media in post.media:
        if media.type.lower() == "video":
            continue

        # Preprocess image cho violence model (128x128)
        img_array = preprocess_image_violence(media.url)
        violence_img_array = np.expand_dims(img_array, axis=0)
        violence_pred = violence_model.predict(violence_img_array, verbose=0)[0][0]
        violence_predictions.append(violence_pred)

    if not violence_predictions:
        # Nếu không có ảnh, mặc định là non-violence
        avg_violence_pred = 0.0
    else:
        avg_violence_pred = np.mean(violence_predictions)

    # Tạo mảng kết quả cho violence detection
    final_prediction = np.zeros(2)
    final_prediction[0] = 1 - avg_violence_pred  # Non-Violence probability
    final_prediction[1] = avg_violence_pred      # Violence probability
    
    return final_prediction

def hate_model_predict(post: Post) -> np.ndarray:
    """Dự đoán hate speech với model 224x224"""
    img_arrays = []
    for media in post.media:
        if media.type.lower() == "video":
            continue
        # Preprocess image cho hate speech model (224x224)
        img_array = preprocess_image_hate(media.url)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        img_arrays.append(img_array)

    # Xử lý text
    cleaned_text = preprocess_text(post.content)
    text_sequence = tokenizer.texts_to_sequences([cleaned_text])
    text_padded = pad_sequences(text_sequence, maxlen=100)

    # Kết hợp image + text
    multimodal_predictions = []
    if img_arrays:
        for img_array in img_arrays:
            prediction = multimodal_model.predict([img_array, text_padded], verbose=0)
            multimodal_predictions.append(prediction[0])
    else:
        # Fallback khi không có ảnh
        prediction = multimodal_model.predict(
            [np.zeros((1, 224, 224, 3)), text_padded], verbose=0
        )
        multimodal_predictions.append(prediction[0])

    # Lấy kết quả trung bình
    avg_prediction = np.mean(multimodal_predictions, axis=0)
    return avg_prediction