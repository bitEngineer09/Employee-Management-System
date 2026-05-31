# face-api.js Model Weights

This directory must contain the face-api.js neural network weight files.
The project uses **Tiny Face Detector** (faster and lighter than SSD MobileNet V1).

## Required Files

Download from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

### Tiny Face Detector (Face Detection)
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`

### Face Landmark 68 Net
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`

### Face Recognition Net
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `face_recognition_model-shard2`

## Quick Download (curl)

```bash
cd frontend/public/models

BASE=https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights

# Tiny Face Detector
curl -O $BASE/tiny_face_detector_model-weights_manifest.json
curl -O $BASE/tiny_face_detector_model-shard1

# Face Landmark 68
curl -O $BASE/face_landmark_68_model-weights_manifest.json
curl -O $BASE/face_landmark_68_model-shard1

# Face Recognition
curl -O $BASE/face_recognition_model-weights_manifest.json
curl -O $BASE/face_recognition_model-shard1
curl -O $BASE/face_recognition_model-shard2
```

> Total size: ~3.5 MB (smaller than SSD MobileNet V1)

Add `public/models/` to `.gitignore` — these are binary weights, not source files.
