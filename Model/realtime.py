import cv2
from keras.models import model_from_json
import numpy as np

# Load model structure
with open("emotiondetector.json", "r") as json_file:
    model = model_from_json(json_file.read())

# Load model weights
model.load_weights("emotiondetector.keras")
print("✅ Model loaded successfully!")

# Load face detection model
haar_file = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(haar_file)

# Preprocess image for model
def extract_features(image):
    feature = np.array(image)
    feature = feature.reshape(1, 48, 48, 1)
    return feature / 255.0

# Start webcam
webcam = cv2.VideoCapture(0)
labels = {
    0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy',
    4: 'neutral', 5: 'sad', 6: 'surprise'
}

print("🎥 Starting real-time emotion detection... Press ESC to exit.")

while True:
    ret, frame = webcam.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        roi = gray[y:y + h, x:x + w]
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

        if roi.shape[0] > 0 and roi.shape[1] > 0:
            roi_resized = cv2.resize(roi, (48, 48))
            img = extract_features(roi_resized)
            prediction = model.predict(img)
            emotion = labels[prediction.argmax()]
            cv2.putText(frame, emotion, (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    cv2.imshow("Real-time Emotion Detection", frame)
    
    if cv2.waitKey(1) & 0xFF == 27:  # ESC key to exit
        break

webcam.release()
cv2.destroyAllWindows()
