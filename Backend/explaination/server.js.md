# server.js

The main entry point for the backend application.

## Responsibilities
- **Server Initialization**: Creates an Express application and wraps it in an HTTP server to support Socket.IO.
- **Database Connection**: Triggers the Mongoose connection to MongoDB.
- **Socket.IO Setup**: Initializes the real-time server with CORS support to allow requests from the frontend.
- **Routing**: Registers the two primary API routers:
    - `userRouter`: Handles authentication and profile management.
    - `chatRouter`: Handles the real-time AI conversation logic (the `io` instance is passed here for direct communication).
- **Port Management**: Dynamically assigns the server to a port (defaulting to 5000).
