# RootLayout.jsx

The master layout shell wraps all non-3D pages in the application.

## Responsibilities
- **Navigation Bar**: A responsive, blur-effect header with navigation links (`Home`, `UserGuide`, `Account`, `About`).
- **Dynamic Backgrounds**: 
    - Implements a stunning `ShaderGradient` background that feels premium and interactive.
    - Conditionally hides the background when the user is in the specialized `/avatar` view.
- **Search & Commands**: Includes a search bar that doubles as a command terminal for quick navigation (e.g., typing "login" and pressing Enter).
- **User Session**: Syncs with `localStorage` to display the user's name and profile picture in the header, defaulting to "Guest" if not logged in.
- **Mobile Support**: Includes a slide-down mobile menu for smaller screens.
