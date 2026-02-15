# speak.js

The voice synthesis service powered by ElevenLabs.

## Features
- **Dynamic Voice Selection**: Accepts a `voiceId` from the frontend, allowing each companion to have a unique, distinct voice.
- **Pronunciation Fixes**: Includes a specialized "patch" to ensure EVA pronounces her own name correctly (converting "EVA" to "Eee-va" in the text sent to the API).
- **Efficiency**: Generates the audio file locally, reads it into a Base64 string for immediate streaming to the frontend via Socket.IO, and then securely deletes the temporary file to save disk space.
