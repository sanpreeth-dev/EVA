# Emotion Model Setup Guide

This folder contains the Python-based Facial Expression Recognition (FER) model used by EVA to detect user emotions in real-time.

## Prerequisites

-   [Python 3.8 - 3.11](https://www.python.org/)
-   `pip` (Python package installer)

## Installation

The Backend project expects a virtual environment named `venv` to exist inside this directory.

1.  Open your terminal and navigate to the `Model` directory:
    ```bash
    cd Model
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    -   **Windows**:
        ```bash
        .\venv\Scripts\activate
        ```
    -   **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```
4.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Model

### Implicit Usage (Backend)
The Backend will automatically launch the emotion engine using the `venv` created above when it starts.

### Manual Testing
You can test the emotion detection scripts manually:
-   `realtime.py`: Run this to test emotion detection using your webcam locally.
    ```bash
    python realtime.py
    ```
-   `prediction.py`: Used for individual frame prediction logic.

## Project Contents
-   `emotiondetector.json` & `emotiondetector.keras`: The trained model files.
-   `TrainedModel.ipynb`: Jupyter notebook used for training the model.
-   `images/`: Dataset used for training/validation.

> [!NOTE]
> The first time you run the model, it may take a few seconds to load TensorFlow and the Keras model files.
