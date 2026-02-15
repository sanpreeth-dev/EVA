import cv2
import sys
import os
import numpy as np
import base64
import json
from keras.models import model_from_json

# Set working directory to script location to find internal files
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Load model structure
def load_model():
    try:
        with open("emotiondetector.json", "r") as json_file:
            model = model_from_json(json_file.read())

        if os.path.exists("emotiondetector.keras"):
            model.load_weights("emotiondetector.keras")
        elif os.path.exists("face_model.h5"):
            model.load_weights("face_model.h5")
        else:
            return None, "ERROR: No weights found"
        
        return model, None
    except Exception as e:
        return None, str(e)

model, err = load_model()
if err:
    print(json.dumps({"error": err}))
    sys.exit(1)

# Load face detection models (Primary + Fallbacks)
haar_path = cv2.data.haarcascades
face_cascade = cv2.CascadeClassifier(haar_path + 'haarcascade_frontalface_default.xml')
face_cascade_alt = cv2.CascadeClassifier(haar_path + 'haarcascade_frontalface_alt.xml')
face_cascade_alt2 = cv2.CascadeClassifier(haar_path + 'haarcascade_frontalface_alt2.xml')

# Labels from realtime.py (Exact match)
labels = {
    0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy',
    4: 'neutral', 5: 'sad', 6: 'surprise'
}

def extract_features(image):
    feature = np.array(image)
    feature = feature.reshape(1, 48, 48, 1)
    return feature / 255.0

def predict_emotion(image_data):
    try:
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return "unknown"

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Multi-stage detection
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        if len(faces) == 0:
            faces = face_cascade_alt.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
        
        if len(faces) == 0:
            faces = face_cascade_alt2.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))

        if len(faces) == 0:
            return "no_face"

        (x, y, w, h) = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)[0]
        roi = gray[y:y + h, x:x + w]
        
        if roi.shape[0] > 0 and roi.shape[1] > 0:
            roi_resized = cv2.resize(roi, (48, 48))
            img = extract_features(roi_resized)
            prediction = model.predict(img, verbose=0)
            emotion = labels[prediction.argmax()]
            return emotion.lower()
        
        return "unknown"
    except Exception as e:
        return f"error: {str(e)}"

# Main Loop: Read from stdin, write to stdout
if __name__ == "__main__":
    # Signal that we are ready
    # print("READY", flush=True) # Don't print this, it will confuse the first result
    
    while True:
        line = sys.stdin.readline()
        if not line:
            break
        
        image_data = line.strip()
        if not image_data:
            continue
            
        result = predict_emotion(image_data)
        print(result, flush=True)
