# user.js (Route)

Handles all traditional REST API endpoints related to user accounts and data management.

## Endpoints
- **Signup/Login**: Manages user registration and authentication using JWT tokens.
- **History**: Allows the frontend to fetch a user's full conversation history for display on the Account page.
- **Memory Compression**: Triggers a "Summarization" event whenever a user logs out, ensuring their most recent chat is condensed into a readable history.
- **Cron Jobs**:
    - **Nightly Update**: Runs at Midnight to perform deep batch processing on user data.
    - **Cleanup**: Runs at 1 AM to remove old, redundant archives and optimize database performance.
- **Context Management**: Allows users to manually view and update their "Personal Context" (Bio) that EVA uses for memory.
