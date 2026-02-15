# Avatar.jsx

The most complex component in the system, responsible for rendering and animating the 3D companion.

## Key Features
- **Conditional Loading**: It uses specialized loaders (`FbxAvatarLoader` and `GlbAvatarLoader`) to only fetch the animations required for the selected avatar (Jane vs. Vijay), optimizing memory usage.
- **Lip-Sync**: Real-time mouth movements synchronized with audio using morph targets (`viseme_PP`, `viseme_AA`, etc.).
- **Facial Expressions**: Applies blendshapes like `smile`, `sad`, `angry`, and `surprised` based on the AI's emotional analysis.
- **Dynamic Animations**: Transitions between `Idle`, `Talking`, and `Greeting` states smoothly using Three.js `AnimationMixer`.
- **Optimization**: Implements custom track filtering to remove problematic bones and disables frustum culling for consistent visibility during zooms.
