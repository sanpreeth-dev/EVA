# Account.jsx

The user's personal dashboard for managing their profile and companion settings.

## Features
- **Context Persistence**: Allows users to edit an "EVA Context Log" (bio). This text is sent to the backend to personalize EVA's responses based on the user's history and preferences.
- **Companion Selection**: A visual grid that allows users to switch between available avatars (JANE, VIJAY, ORANGE). Switching here updates the global state and `localStorage`.
- **Session Management**: Provides a clear Logout button that clears authentication tokens and redirects to the home page.
- **Loading/Error States**: Includes robust handling for network requests using TanStack Query.
