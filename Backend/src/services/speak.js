const ElevenLabs = require("elevenlabs-node");
const path = require("path");

// Initialize Client (Lazy load)
let client;

// Default Voice ID
// '21m00Tcm4TlvDq8ikWAM' is Rachel (American, Soft)
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 

const generateAudio = async (text, voiceId = DEFAULT_VOICE_ID) => {
  try {
    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    
    if (!apiKey) {
        console.error("❌ MISSING API KEY: Please add ELEVEN_LABS_API_KEY to config/dev.env");
        return null;
    }

    if (!client) {
        client = new ElevenLabs({
            apiKey: apiKey,
            voiceId: DEFAULT_VOICE_ID // Initial default
        });
    }

    // 🗣️ Pronunciation Fixes
    // User requested "EeeVAaaa" style pronunciation
    const procText = text.replace(/\bEVA\b/gi, "Eee-va"); 

    console.log(`🎤 Generating Audio for: "${procText.substring(0, 20)}..." with Voice: ${voiceId}`);

    // Determine path to save the test file
    const outputPath = path.join(process.cwd(), "test_audio.mp3");

    // The community wrapper's textToSpeech saves the file directly
    const response = await client.textToSpeech({
        fileName: outputPath,
        textInput: procText,
        voiceId: voiceId,
        stability: 0.5,
        similarityBoost: 0.5
    });

    if (response && response.status === "ok") {
         console.log(`✅ Audio successfully generated and saved to: ${outputPath}`);
         // Read file and convert to Base64
         const fs = require('fs');
         const audioBuffer = fs.readFileSync(outputPath);
         const base64Audio = audioBuffer.toString('base64');
         
         // Clean up temp file
         try {
            fs.unlinkSync(outputPath);
         } catch(e) { console.error("Could not delete temp audio file", e); }

         return base64Audio;
    } else {
         console.error("❌ ElevenLabs Error. Response:", response ? JSON.stringify(response) : "NULL/UNDEFINED");
         return null;
    }

  } catch (error) {
    console.error("❌ Audio Generation Failed:", error);
    return null;
  }
};

module.exports = { generateAudio };
