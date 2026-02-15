import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";


import * as THREE from "three";

export default function Avatar() {
  return (
    <>
      <Loader />
      <Leva hidden />
      <UI />
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 1], fov: 30, near: 0.1 }}
        gl={{
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
}

