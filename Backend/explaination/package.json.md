# package.json

The configuration file for the Node.js backend environment.

## Scripts
- `npm run dev`: Uses `nodemon` to automatically restart the server whenever code changes are detected, accelerating development.

## Key Dependencies
- **Express**: The core web framework for handling API requests.
- **Socket.IO**: Enables real-time, bi-directional communication with the frontend (critical for interactive AI characters).
- **Mongoose**: The ODM (Object Data Modeling) library used to interact with the MongoDB database.
- **LangChain**: Orchestrates the complex AI workflows, including RAG (Retrieval-Augmented Generation) and message passing to Gemini.
- **Gemini AI**: The LLM (Large Language Model) that serves as EVA's "brain."
- **ElevenLabs Node**: Facilitates high-quality text-to-speech generation.
- **Bcrypt & JWT**: Used for secure password hashing and token-based user authentication.
