# canvas.jsx

The container for the 3D experience.

## Responsibilities
- **Loader**: Displays a progress bar while 3D assets are loading.
- **Canvas Setup**: Initializes the React Three Fiber `Canvas` with:
    - **Resolution Scaling**: Optimizes for performance using `dpr={[1, 2]}`.
    - **Lighting/Shadows**: Enables shadow mapping.
    - **Tone Mapping**: Configures professional cinematic tone mapping (`ACESFilmicToneMapping`).
- **UI & Experience**: Renders the 2D overlay (`UI.jsx`) and the 3D world (`Experience.jsx`).
