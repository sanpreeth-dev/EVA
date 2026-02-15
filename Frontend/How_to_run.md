# Frontend Setup Guide

This folder contains the React + Vite frontend for EVA, featuring a 3D avatar powered by React Three Fiber.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   [npm](https://www.npmjs.com/) (installed with Node.js)

## Installation

1.  Open your terminal and navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

## Running the Development Server

To start the frontend application:
```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`. Open this URL in your browser to interact with EVA.

## Configuration

The frontend is configured to talk to the backend at `http://localhost:5000`. If your backend is running on a different port, you will need to update the following files:
- `src/utils/chat.js`
- `src/hooks/ChatContext.jsx`

## Tech Stack
-   **React**: UI Library
-   **Vite**: Build Tool
-   **Three.js / React Three Fiber**: 3D Rendering
-   **Tailwind CSS**: Styling
-   **Socket.io-client**: Real-time communication with the backend
