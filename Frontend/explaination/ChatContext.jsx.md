# ChatContext.jsx

The "brain" of the frontend, managing all global states related to the AI interaction.

## Responsibilities
- **State Management**: Tracks the conversation message queue, the current active message, loading states, camera zoom, and audio synchronization data (current time / total duration).
- **Socket.IO Integration**: Maintains a persistent connection to the backend. It listens for `ai_audio_response` to populate the message queue and `emotion_detected` to update the user's analyzed mood.
- **Core Actions**:
    - `chat(text)`: Sends the user's query and current emotion to the backend via sockets.
    - `playIntro()`: Manages the automated first greeting for the selected avatar.
    - `detectEmotion(image)`: Sends captured webcam frames to the backend for analysis.
- **Persistence**: Automatically saves and loads the user's selected avatar from `localStorage`.
- **Audio Sync**: Provides real-time updates of the audio playback progress to power the lip-sync and karaoke text.
