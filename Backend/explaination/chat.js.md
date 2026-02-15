# chat.js (Route)

The primary controller for the AI conversation engine, utilizing Socket.IO for real-time interaction.

## Core Logic
- **Memory Integration**: Upon connection, it fetches the user's "Long Term Memory" (Bio) and "Short Term Memory" (recent summaries) from MongoDB.
- **Dynamic System Instructions**: Merges the user's personal details into a master instruction set for Gemini, ensuring EVA knows who she is talking to and remembers past conversations.
- **Model Fleet**: Implements a "retry loop" across multiple models (Gemini Flash, Pro, and Gemma). If one model is overloaded, it automatically tries the next one in the fleet.
- **RAG & Emotion**: 
    - Injects medical/scientific context retrieved via the RAG service.
    - Captures the user's current detected emotion to trigger empathetic responses.
- **Multimodal Response**: Generates text, audio, and lip-sync data simultaneously and streams it back to the frontend in a single consolidated event.
- **History Archiving**: Automatically saves every exchange to the `ChatHistory` collection in MongoDB.
