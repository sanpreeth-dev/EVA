# emotionService.js

The bridge between our Node.js server and the Python-based AI Emotion Engine.

## Responsibilities
- **Child Process Management**: Spawns and manages a persistent Python process running TensorFlow.
- **Data Pipeline**: Sends raw base64 image data from the user's webcam and receives JSON results containing the detected emotion (e.g., "Happy", "Sad", "Neutral").
- **Robustness**: Automatically monitors the Python script's health and can restart the engine if it crashes or stops responding.
- **Log Filtering**: Cleans up messy TensorFlow "Information" logs so the server console only shows important data.
