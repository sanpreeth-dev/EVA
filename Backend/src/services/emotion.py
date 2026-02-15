import cv2
import sys
import os
import numpy as np
import base64
from keras.models import model_from_json

# Set working directory to script location to find internal files
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Load model structure
try:
    with open("emotiondetector.json", "r") as json_file:
        model = model_from_json(json_file.read())

    # Load model weights (preferring emotiondetector.keras as it exists, but allowing face_model.h5)
    if os.path.exists("emotiondetector.keras"):
        model.load_weights("emotiondetector.keras")
    elif os.path.exists("face_model.h5"):
        model.load_weights("face_model.h5")
    else:
        print("ERROR: No weights found (tried emotiondetector.keras and face_model.h5)")
        sys.exit(1)
except Exception as e:
    print(f"ERROR: Model loading failed: {e}")
    sys.exit(1)

# Load face detection model
haar_file = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(haar_file)

# Labels specifically from realtime.py 
labels = {
    0: 'Angry', 1: 'Disgust', 2: 'Fear', 3: 'Happy',
    4: 'Neutral', 5: 'Sad', 6: 'Surprise'
}

def extract_features(image):
    feature = np.array(image)
    feature = feature.reshape(1, 48, 48, 1)
    return feature / 255.0

def predict_emotion(image_data):
    # Decode base64 image
    try:
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return "unknown"

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return "no_face"

        # Take the largest face found
        (x, y, w, h) = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)[0]
        roi = gray[y:y + h, x:x + w]
        
        if roi.shape[0] > 0 and roi.shape[1] > 0:
            roi_resized = cv2.resize(roi, (48, 48))
            img = extract_features(roi_resized)
            prediction = model.predict(img, verbose=0)
            emotion = labels[prediction.argmax()]
            return emotion.lower() # Return lowercase for consistency
        
        return "unknown"
    except Exception as e:
        return f"error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        img_data = sys.argv[1]
        result = predict_emotion(img_data)
        print(result)
    else:
        print("error: No image data provided")
