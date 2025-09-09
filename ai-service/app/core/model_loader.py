import pickle
from tensorflow.keras.models import load_model

# Load tokenizer
with open(r"C:\Users\FPTSHOP\OneDrive\Máy tính\data_hatespeech\models\tokenizer.pkl", "rb") as handle:
    tokenizer = pickle.load(handle)

print("Tokenizer loaded successfully!")

# Load multimodal model
multimodal_model = load_model(r"C:\Users\FPTSHOP\OneDrive\Máy tính\data_hatespeech\models\multimodal_model.h5")
print("Model loaded successfully!")

# Load violence model
violence_model = load_model(r"D:\OU\graduation-project\smart-social-network\ai-service\app\data\models\resnet50_finetuned_model.h5")