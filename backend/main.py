from fastapi import FastAPI, File, UploadFile

app = FastAPI(title="AgroScan API")


@app.get("/")
def home():
    return {
        "message": "AgroScan API is running!"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Temporary mock prediction
    # This will be replaced with the real ML model later.

    return {
        "disease": "Tomato___Early_blight",
        "confidence": 0.92,
        "message": "Prediction generated successfully"
    }