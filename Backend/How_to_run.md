# Backend Setup Guide

This folder contains the Node.js/Express server that serves as the "brain" of EVA.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   [npm](https://www.npmjs.com/) (installed with Node.js)
-   Python 3.x (with `venv` setup in the `Model` folder)

## Installation

1.  Open your terminal and navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

## Configuration

The backend requires environment variables to function correctly. These are to be stored in `config/dev.env`.

### Environment Variables Template
Create or update `config/dev.env` with the following:

```env
PORT=5000
Mongo_URL=your_mongodb_connection_string
TOKEN=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
ELEVEN_LABS_API_KEY=your_eleven_labs_api_key
```

> [!IMPORTANT]
> Ensure the `Model` folder has a virtual environment (`venv`) set up, as the Backend will try to launch a Python process from `../Model/venv/Scripts/python.exe`.

## Running the Server

To start the server in development mode (with auto-reload):
```bash
npm run dev
```

The server will start on `http://localhost:5000`.

## Key Features
-   **Socket.io**: Real-time communication with the frontend.
-   **RAG (Retrieval-Augmented Generation)**: Uses LangChain and MongoDB for knowledge retrieval.
-   **Emotion Integration**: Bridges the Frontend webcam stream to the Python Emotion Detection Model.
