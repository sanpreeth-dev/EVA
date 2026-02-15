/**
 * Generates approximate mouth cues for lip sync based on text.
 * This is a heuristic approach to avoid external binary dependencies.
 * @param {string} text - The text to speak.
 * @returns {object} - Object containing mouthCues.
 */
const generateLipSync = (text) => {
    const mouthCues = [];
    const words = text.split(" ");
    let currentTime = 0;
  
    // Average speech rate: ~0.3 - 0.5 seconds per word
    // We'll vary it slightly for realism

  
    words.forEach(word => {
        const duration = Math.max(0.2, word.length * 0.08); 
        const start = currentTime;
        const end = currentTime + duration;
        const step = (end - start) / word.length;
        
        // Scan each letter to approximate a shape
        for (let i = 0; i < word.length; i++) {
            const char = word[i].toUpperCase();
            let viseme = "X";

            if (['A', 'E', 'I'].includes(char)) viseme = "C"; // Wide/Flat
            else if (['O', 'U'].includes(char)) viseme = "E"; // Round
            else if (['B', 'M', 'P'].includes(char)) viseme = "A"; // Closed/Press
            else if (['F', 'V'].includes(char)) viseme = "G"; // Bite
            else if (['L', 'T', 'D'].includes(char)) viseme = "B"; // Tongue/Open
            else if (['W', 'Q'].includes(char)) viseme = "E"; 
            else viseme = "B"; // Default open-ish

            // Add cues for every few letters to prevent jitter
            if (i % 2 === 0 || ['A','O','M'].includes(viseme)) {
                 mouthCues.push({
                    start: start + (i * step),
                    end: start + ((i + 2) * step), // overlap slightly
                    value: viseme
                });
            }
        }

        // Pause after word
        mouthCues.push({
            start: end,
            end: end + 0.05,
            value: "X"
        });
  
        currentTime += duration + 0.1;
    });
  
    return { mouthCues };
  };
  
  module.exports = { generateLipSync };
