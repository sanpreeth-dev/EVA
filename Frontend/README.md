# EVA - Virtual Girlfriend Frontend

EVA is an interactive 3D Virtual Girlfriend interface built with React, Three.js, and modern web technologies. This project features a 3D avatar that can interact with users through a chat interface, providing a unique and immersive experience.

## ✨ Features

- **3D Avatar Integration**: Powered by `@react-three/fiber` and `@react-three/drei` for realistic 3D rendering.
- **Interactive Chat**: Real-time chat interface to communicate with EVA.
- **Voice Interaction**: (Implied capability) seamless voice-driven experiences.
- **Modern UI**: Styled with **TailwindCSS** and custom shaders for a premium, glassmorphic aesthetic.
- **Smooth Animations**: Utilizes `framer-motion` and `GSAP` for fluid UI transitions.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **3D Engine**: [Three.js](https://threejs.org/) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **State Management**: [Leva](https://github.com/pmndrs/leva) (for debug controls)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** installed on your system.

### Installation

1.  Clone the repository and navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn
    ```

3.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```
Frontend/
├── public/             # Static assets (3D models, textures, etc.)
├── src/
│   ├── assets/         # Local static assets (images, icons)
│   ├── components/     # Reusable UI components (Chat, Input, UI overlays)
│   ├── hooks/          # Custom React hooks (e.g., useChat)
│   ├── pages/          # Application pages (Home, Login, ErrorPage)
│   ├── App.jsx         # Main application entry point
│   ├── canvas.jsx      # 3D Scene setup
│   ├── index.css       # Global styles (Tailwind directives)
│   └── main.jsx        # React DOM rendering
├── docs/               # Project documentation
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server. |
| `npm run build` | Builds the app for production. |
| `npm run preview` | Locally preview the production build. |
