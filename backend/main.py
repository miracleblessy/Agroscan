
from pathlib import Path
from io import BytesIO
import sys

import numpy as np
import tensorflow as tf
from PIL import Image
from fastapi import FastAPI, File, HTTPException, UploadFile

app = FastAPI(title="AgroScan API")

# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model" / "plant_disease_model.keras"
CLASS_NAMES_PATH = BASE_DIR / "model" / "class_names.txt"

# Import the shared database functions
sys.path.insert(0, str(BASE_DIR))
from database.db_connection import create_tables, save_prediction

# Load trained model and class names
model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
    class_names = [line.strip() for line in f if line.strip()]


@app.on_event("startup")
def initialize_database():
    create_tables()


@app.get("/")
def home():
    return {"message": "AgroScan API is running!"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in (
        "image/jpeg", "image/png", "image/webp"
    ):
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, PNG, or WEBP image."
        )

    try:
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image = image.resize((224, 224))

        image_array = np.asarray(image, dtype=np.float32)
        image_array = np.expand_dims(image_array, axis=0)

        predictions = model.predict(image_array, verbose=0)[0]

        if len(predictions) != len(class_names):
            raise HTTPException(
                status_code=500,
                detail="Model output does not match class_names.txt."
            )

        predicted_index = int(np.argmax(predictions))
        disease = class_names[predicted_index]
        confidence = float(predictions[predicted_index])

        # Extract plant name from the model class label
        plant_name = disease.split("___")[0].replace("_", " ")

        # Save prediction in SQLite history
        save_prediction(
            image_name=Path(file.filename or "uploaded_image").name,
            plant_name=plant_name,
            disease_name=disease,
            confidence=confidence
        )

        return {
            "plant": plant_name,
            "disease": disease,
            "confidence": round(confidence, 4),
            "message": "Prediction generated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not process image: {str(e)}"
        )
