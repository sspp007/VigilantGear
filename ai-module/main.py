import os
import tempfile
import cv2
from fastapi import FastAPI, UploadFile, File, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from ultralytics import YOLO

load_dotenv()

app = FastAPI(title="VigilantGear AI Module")

# Allow requests from the React frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.getenv("PPE_MODEL_PATH", "./models/ppe_model.pt")
CONF_THRESHOLD = float(os.getenv("PPE_CONFIDENCE_THRESHOLD", "0.50"))
FRAME_INTERVAL = int(os.getenv("VIDEO_FRAME_INTERVAL", "15"))
SERVICE_TOKEN = os.getenv("AI_SERVICE_TOKEN", "")

model = YOLO(MODEL_PATH)

def verify_token(token: str):
    if SERVICE_TOKEN and token != SERVICE_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid AI service token")

def parse_detections(results):
    detections = []
    for r in results:
        img_h, img_w = r.orig_shape
        for box in r.boxes:
            cls_id = int(box.cls[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            detections.append({
                "class_id": cls_id,
                "label": model.names[cls_id],
                "confidence": round(float(box.conf[0]), 4),
                "bbox": [round(x1, 2), round(y1, 2), round(x2, 2), round(y2, 2)],
                # Percentage coordinates (0-100) matching VigilantGear UI overlay schema
                "box_pct": {
                    "left": round((x1 / img_w) * 100, 2),
                    "top": round((y1 / img_h) * 100, 2),
                    "width": round(((x2 - x1) / img_w) * 100, 2),
                    "height": round(((y2 - y1) / img_h) * 100, 2),
                },
            })
    return detections

@app.get("/health")
def health_check():
    return {"status": "ok", "model": MODEL_PATH, "classes": model.names}

@app.post("/predict/image")
async def predict_image(
    file: UploadFile = File(...),
    x_service_token: str = Header(default="")
):
    verify_token(x_service_token)

    suffix = os.path.splitext(file.filename or "frame.jpg")[1] or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        results = model.predict(source=tmp_path, conf=CONF_THRESHOLD, verbose=False)
        return {"detections": parse_detections(results)}
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/predict/video")
async def predict_video(
    file: UploadFile = File(...),
    x_service_token: str = Header(default="")
):
    verify_token(x_service_token)

    suffix = os.path.splitext(file.filename or "video.mp4")[1] or ".mp4"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        cap = cv2.VideoCapture(tmp_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        duration_seconds = round(total_frames / fps, 1) if total_frames > 0 else 10.0

        sampled_frames = []
        frame_idx = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % FRAME_INTERVAL == 0:
                results = model.predict(source=frame, conf=CONF_THRESHOLD, verbose=False)
                dets = parse_detections(results)
                if dets:
                    sampled_frames.append({
                        "frame": frame_idx,
                        "timestamp_seconds": round(frame_idx / fps, 2),
                        "detections": dets,
                    })
            frame_idx += 1

        cap.release()
        return {
            "file_name": file.filename,
            "duration_seconds": duration_seconds,
            "frames_analyzed": len(sampled_frames),
            "timeline": sampled_frames,
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)