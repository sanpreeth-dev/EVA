# main.jsx

The entry point of the React application. 

## Responsibilities
- **Root Rendering**: Hooks the React application into the `index.html` root element.
- **Provider Injection**: Wraps the entire `App` with `ChatProvider` to ensure the chat state is accessible everywhere.
- **Global Tweak**: Includes a suppressive fix for a deprecated Three.js console warning (`dampingFactor`) to keep the developer logs clean.
- **Styles**: Imports the global `index.css`.
