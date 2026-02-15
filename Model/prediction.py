import numpy as np
from tensorflow.keras.models import model_from_json
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# Load model architecture from JSON file
with open("emotiondetector.json", "r") as json_file:
    model_json = json_file.read()
model = model_from_json(model_json)

# Load model weights
model.load_weights("face_model.h5")
print("✅ Model loaded successfully!")

# Compile the model (required before prediction if you want to evaluate later)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Define emotion classes (update based on your training labels)
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Load and preprocess an image (replace with your test image path)
img_path = "images/train/disgust/299.jpg"  # <<< Replace this with your image path
img = load_img(img_path, target_size=(48, 48), color_mode="grayscale")
img_array = img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array /= 255.0  # Normalization

# Predict
prediction = model.predict(img_array)
predicted_class = emotion_labels[np.argmax(prediction)]

print(f"🧠 Predicted Emotion: {predicted_class}")
