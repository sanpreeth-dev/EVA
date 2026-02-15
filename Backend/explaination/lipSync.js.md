# lipSync.js

An intelligent heuristic engine that generates mouth movements without requiring heavy external software like Rhubarb.

## How it Works
1. **Tokenization**: It breaks down the AI's response text into individual words and letters.
2. **Viseme Mapping**: It analyzes each character and maps it to a standard viseme (mouth shape):
    - `A`, `E`, `I` -> **C** (Wide)
    - `O`, `U` -> **E** (Round)
    - `B`, `M`, `P` -> **A** (Closed)
    - `F`, `V` -> **G** (Bite)
3. **Timing**: Calculates the start and end times for each mouth shape based on an average speech rate.
4. **Data Sync**: Returns a JSON object of "mouth cues" that the 3D avatar in the frontend uses to move its lips in perfect sync with the audio.
