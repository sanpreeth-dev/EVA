# Experience.jsx

Defines the 3D environment and scene hierarchy.

## Contents
- **Camera Management**: Uses `CameraControls` to handle smooth transitions between "Zoom In" (face-to-face) and "Zoom Out" perspectives.
- **Lighting & Environment**: 
    - Loads a "sunset" environment preset for natural lighting.
    - Implements `ContactShadows` for realistic grounding of the avatar.
- **Loading UI**: Renders a 3D animated `Dots` component while the AI is generating a response, keeping the user engaged.
- **Avatar Instance**: Renders the current `Avatar` based on the selected configuration.
