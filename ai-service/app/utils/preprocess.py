import re
import numpy as np
import requests
from io import BytesIO
from PIL import Image
from tensorflow.keras.preprocessing.image import img_to_array

def preprocess_text(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r"\@\w+|\#", "", text)
    text = re.sub(r"\d+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(
        r"[\U0001F600-\U0001F64F"
        r"\U0001F300-\U0001F5FF"
        r"\U0001F680-\U0001F6FF"
        r"\U0001F1E0-\U0001F1FF"
        r"\U00002702-\U000027B0"
        r"\U000024C2-\U0001F251"
        r"\U0001F900-\U0001F9FF"
        r"\U0001FA70-\U0001FAFF"
        r"\U00002600-\U000026FF"
        r"\U00002300-\U000023FF"
        r"]+", "", text, flags=re.UNICODE,
    )
    return text

def preprocess_image_violence(image_url: str, target_size=(128, 128)):
    """Preprocess image cho violence model (128x128)"""
    try:
        response = requests.get(image_url, timeout=5)
        response.raise_for_status()
        
        image_data = BytesIO(response.content)
        image = Image.open(image_data)
        if image.mode != "RGB":
            image = image.convert("RGB")
        image = image.resize(target_size)
        image = img_to_array(image) / 255.0  # Normalize về [0, 1]
        return image
    except Exception:
        return np.zeros((target_size[0], target_size[1], 3), dtype=np.float32)

def preprocess_image_hate(image_url: str, target_size=(224, 224)):
    """Preprocess image cho hate speech model (224x224)"""
    try:
        response = requests.get(image_url, timeout=5)
        response.raise_for_status()
        
        image_data = BytesIO(response.content)
        image = Image.open(image_data)
        if image.mode != "RGB":
            image = image.convert("RGB")
        image = image.resize(target_size)
        image = img_to_array(image)
        return image  # Không normalize ở đây, sẽ dùng preprocess_input
    except Exception:
        return np.zeros((target_size[0], target_size[1], 3), dtype=np.float32)
