# avatarConfig.js

A centralized configuration file containing all the data for the available AI companions.

## Data Structure
Each avatar object includes:
- **Identity**: Name and thumbnail image path.
- **3D Model**: Paths to the GLB/FBX files and an `animationType` flag (specifying if they use GLB baked animations or individual FBX files).
- **Voice**: The specific ElevenLabs `voiceId` used for text-to-speech.
- **Greeting**: 
    - `introAudio`: Local MP3 path.
    - `introText`: The text transcript of the greeting.
    - `mouthCues`: A manually fine-tuned list of lip-sync timings (visemes) for the intro, ensuring a perfect first impression without backend latency.
