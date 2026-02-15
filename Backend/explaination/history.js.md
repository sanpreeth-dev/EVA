# history.js

Manages the persistent memory of conversations between the user and EVA.

## Key Features
- **Database Storage**: Saves every user message and AI response into MongoDB, categorized by User ID.
- **Context Retrieval**: When a user asks a new question, this service fetches the most recent conversation turns and provides them to Gemini as "Chat History." This allows EVA to remember what were talking about moments ago.
- **Context Archiving**: Includes a logic to "summarize" or archive old messages using a cron job (scheduled task) to keep the database size manageable while retaining important long-term context.
