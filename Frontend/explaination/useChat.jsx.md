# useChat.jsx

A custom React hook that provides a clean, easy-to-use interface for components to interact with the `ChatContext`.

## Usage
- It encapsulates the `useContext(ChatContext)` logic.
- Includes a safety check to ensure it's only called within a `ChatProvider` component, preventing common development errors.
- This modularity prevents Vite HMR (Hot Module Replacement) warnings by keeping the Context and the Hook in separate files.
