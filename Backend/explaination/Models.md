# Models.md

This file summarizes the MongoDB schemas used to structure the application's data.

- **users.js**: Stores account details (username, email, hashed password) and active JWT tokens. Includes a virtual link to automatically fetch a user's chats.
- **history.js**: Stores individual conversation sessions. Each session contains an array of `messages` (user vs. model), a 1-sentence `summary`, and flags for `isActive` and `isArchived`.
- **LongMemory.js**: Stores the "Deep Memory" of a user. This is a condensed life story or bio that EVA uses as a static context to provide a personalized relationship over months or years.
- **knowledge.js**: The storage layer for the RAG system. It contains text chunks from `eva.md` and their corresponding 768-dimensional vector "embeddings."
