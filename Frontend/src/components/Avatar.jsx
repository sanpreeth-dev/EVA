import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

const facialExpressions = {
  default: {},
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.44,
    noseSneerLeft: 0.1700000727403593,
    noseSneerRight: 0.14000002836874015,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41000000000000003,
  },
  funnyFace: {
    jawLeft: 0.63,
    mouthPucker: 0.53,
    noseSneerLeft: 1,
    noseSneerRight: 0.39,
    mouthLeft: 1,
    eyeLookUpLeft: 1,
    eyeLookUpRight: 1,
    cheekPuff: 0.9999924982764238,
    mouthDimpleLeft: 0.414743888682652,
    mouthRollLower: 0.32,
    mouthSmileLeft: 0.35499733688813034,
    mouthSmileRight: 0.35499733688813034,
  },
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    mouthShrugLower: 0.78341,
    browInnerUp: 0.452,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 1,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.351,
    mouthFunnel: 1,
    browInnerUp: 1,
  },
  angry: {
    browDownLeft: 1,
    browDownRight: 1,
    eyeSquintLeft: 1,
    eyeSquintRight: 1,
    jawForward: 1,
    jawLeft: 1,
    mouthShrugLower: 1,
    noseSneerLeft: 1,
    noseSneerRight: 0.42,
    eyeLookDownLeft: 0.16,
    eyeLookDownRight: 0.16,
    cheekSquintLeft: 1,
    cheekSquintRight: 1,
    mouthClose: 0.23,
    mouthFunnel: 0.63,
    mouthDimpleRight: 1,
  },
  crazy: {
    browInnerUp: 0.9,
    jawForward: 1,
    noseSneerLeft: 0.5700000000000001,
    noseSneerRight: 0.51,
    eyeLookDownLeft: 0.39435766259644545,
    eyeLookUpRight: 0.4039761421719682,
    eyeLookInLeft: 0.9618479575523053,
    eyeLookInRight: 0.9618479575523053,
    jawOpen: 0.9618479575523053,
    mouthDimpleLeft: 0.9618479575523053,
    mouthDimpleRight: 0.9618479575523053,
    mouthStretchLeft: 0.27893590769016857,
    mouthStretchRight: 0.2885543872656917,
    mouthSmileLeft: 0.5578718153803371,
    mouthSmileRight: 0.38473918302092225,
    tongueOut: 0.9618479575523053,
  },
};

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

// --- Shared Renderer ---
const AvatarRenderer = ({ animations, nodes, materials, scene, ...props }) => {
  const { message, onMessagePlayed, isSpeaking, setIsSpeaking, setCurrentAudioTime, setTotalAudioDuration } = useChat();
  const [lipsync, setLipsync] = useState();
  const [animation, setAnimation] = useState("Idle");
  const [facialExpression, setFacialExpression] = useState("");
  const [audio, setAudio] = useState();
  const [blink, setBlink] = useState(false);

  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      return;
    }
    const talkingAnimations = ["Talking_0", "Talking_1", "Talking_2"];
    let animationToPlay = message.animation || "Idle";
    if (animationToPlay === "Idle") {
      animationToPlay = talkingAnimations[Math.floor(Math.random() * talkingAnimations.length)];
    }
    setAnimation(animationToPlay);
    setFacialExpression(message.facialExpression || "default");
    setLipsync(message.lipsync);

    let audioObj;
    if (message.audio && message.audio !== "mock_silent") {
      const isUrl = message.audio.startsWith("/");
      audioObj = new Audio(isUrl ? message.audio : "data:audio/mp3;base64," + message.audio);
    } else {
      audioObj = {
        _startTime: Date.now(),
        play: function () {
          this._startTime = Date.now();
          return Promise.resolve();
        },
        get currentTime() { return (Date.now() - this._startTime) / 1000; },
        duration: message.lipsync?.mouthCues?.length > 0
          ? message.lipsync.mouthCues[message.lipsync.mouthCues.length - 1].end
          : 4,
        pause: function () { }
      };
    }

    setAudio(audioObj);
    const duration = message.audio && message.audio !== "mock_silent"
      ? (message.lipsync?.mouthCues?.length > 0 ? message.lipsync.mouthCues[message.lipsync.mouthCues.length - 1].end : 0)
      : (message.lipsync?.mouthCues?.length > 0
        ? message.lipsync.mouthCues[message.lipsync.mouthCues.length - 1].end
        : 2);

    setTotalAudioDuration(duration);
    setCurrentAudioTime(0);

    audioObj.play().then(() => {
      setIsSpeaking(true);
    }).catch(e => {
      console.error("Audio play error", e);
      setIsSpeaking(false);
    });

    let mockTimeout;
    if (message.audio && message.audio !== "mock_silent") {
      audioObj.onloadedmetadata = () => {
        setTotalAudioDuration(audioObj.duration);
      };
      audioObj.onended = () => {
        setIsSpeaking(false);
        setCurrentAudioTime(0);
        setTotalAudioDuration(0);
        onMessagePlayed();
      };
    }

    const safetyDuration = (audioObj.duration || 4) * 1000 + 1000;
    mockTimeout = setTimeout(() => {
      setIsSpeaking(false);
      setCurrentAudioTime(0);
      setTotalAudioDuration(0);
      onMessagePlayed();
    }, safetyDuration);

    const effectiveDuration = audioObj.duration || (message.lipsync?.mouthCues?.length > 0 ? message.lipsync.mouthCues[message.lipsync.mouthCues.length - 1].end : 0);
    let switchTimeout;
    if (effectiveDuration > 4) {
      const secondAnimation = talkingAnimations.filter(a => a !== animationToPlay)[Math.floor(Math.random() * (talkingAnimations.length - 1))];
      switchTimeout = setTimeout(() => {
        setAnimation(secondAnimation);
      }, (effectiveDuration / 2) * 1000);
    }

    return () => {
      clearTimeout(mockTimeout);
      clearTimeout(switchTimeout);
      setIsSpeaking(false);
      setCurrentAudioTime(0);
      setTotalAudioDuration(0);
      if (audioObj && audioObj.pause) audioObj.pause();
    };
  }, [message]);

  useEffect(() => {
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
      return () => actions[animation].fadeOut(0.5);
    }
  }, [animation, actions]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index === undefined || child.morphTargetInfluences[index] === undefined) return;
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(child.morphTargetInfluences[index], value, speed);
      }
    });
  };

  useFrame(() => {
    if (nodes.Wolf3D_Head) {
      Object.keys(nodes.Wolf3D_Head.morphTargetDictionary || {}).forEach((key) => {
        const mapping = facialExpressions[facialExpression];
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
        lerpMorphTarget(key, (mapping && mapping[key]) ? mapping[key] : 0, 0.1);
      });
    }

    lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.5);

    const appliedMorphTargets = [];
    if (message && lipsync && audio) {
      const currentAudioTime = audio.currentTime;
      for (let mouthCue of lipsync.mouthCues) {
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          appliedMorphTargets.push(corresponding[mouthCue.value]);
          lerpMorphTarget(corresponding[mouthCue.value], 1, 0.2);
          break;
        }
      }
    }

    Object.values(corresponding).forEach((value) => {
      if (!appliedMorphTargets.includes(value)) lerpMorphTarget(value, 0, 0.1);
    });

    if (isSpeaking && audio) setCurrentAudioTime(audio.currentTime);
  });

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;
      }
    });
  }, [scene]);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={scene} />
    </group>
  );
};

// --- Helper Functions ---
const cleanClips = (rawClips, nodes) => {
  return rawClips.map((clip) => {
    const c = clip.clone();
    c.tracks = c.tracks.filter((track) => {
      const trackName = track.name.replace(/^mixamorig/, "").replace(/^Armature\|/, "");
      const boneName = trackName.split(".")[0];
      const lowerBone = boneName.toLowerCase();
      if (lowerBone.endsWith("_end") || lowerBone.includes("end_end")) return false;
      return nodes[boneName] !== undefined;
    });
    c.tracks.forEach((track) => {
      track.name = track.name.replace(/^mixamorig/, "").replace(/^Armature\|/, "");
    });
    return c;
  });
};

// --- Specialized Loaders ---

const FbxAvatarLoader = ({ nodes, materials, scene, ...props }) => {
  const mIdle = useFBX("/animations/male_aniamtion/Standing Idle.fbx");
  const mTalk0 = useFBX("/animations/male_aniamtion/Talking.fbx");
  const mTalk1 = useFBX("/animations/male_aniamtion/Talking_1.fbx");
  const mTalk2 = useFBX("/animations/male_aniamtion/Talking_2.fbx");
  const mGreeting = useFBX("/animations/male_aniamtion/Waving.fbx");

  const animations = useMemo(() => {
    const sources = [
      { name: "Idle", fbx: mIdle },
      { name: "Talking_0", fbx: mTalk0 },
      { name: "Talking_1", fbx: mTalk1 },
      { name: "Talking_2", fbx: mTalk2 },
      { name: "Greeting", fbx: mGreeting },
    ];
    const clips = sources.map(s => {
      const c = s.fbx.animations[0].clone();
      c.name = s.name;
      return c;
    });
    return cleanClips(clips, nodes);
  }, [nodes, mIdle, mTalk0, mTalk1, mTalk2, mGreeting]);

  return <AvatarRenderer animations={animations} nodes={nodes} materials={materials} scene={scene} {...props} />;
};

const GlbAvatarLoader = ({ nodes, materials, scene, ...props }) => {
  const { animations: glbClips } = useGLTF("/models/animations.glb");
  const fGreeting = useFBX("/animations/Standing Greeting.fbx");

  const animations = useMemo(() => {
    const clips = [...(glbClips || [])].map(c => c.clone());
    if (fGreeting.animations[0]) {
      const c = fGreeting.animations[0].clone();
      c.name = "Greeting";
      clips.push(c);
    }
    return cleanClips(clips, nodes);
  }, [nodes, glbClips, fGreeting]);

  return <AvatarRenderer animations={animations} nodes={nodes} materials={materials} scene={scene} {...props} />;
};

export default function Avatar(props) {
  const { avatar } = useChat();
  const { nodes, materials, scene } = useGLTF(avatar.path);

  if (avatar.animationType === "fbx") {
    return <FbxAvatarLoader nodes={nodes} materials={materials} scene={scene} {...props} />;
  }
  return <GlbAvatarLoader nodes={nodes} materials={materials} scene={scene} {...props} />;
}

useGLTF.preload("/models/EVA.glb");
useGLTF.preload("/models/MAN.glb");
useGLTF.preload("/models/Orange.glb");
useGLTF.preload("/models/animations.glb");
useFBX.preload("/animations/male_aniamtion/Standing Idle.fbx");
useFBX.preload("/animations/male_aniamtion/Talking.fbx");
useFBX.preload("/animations/male_aniamtion/Talking_1.fbx");
useFBX.preload("/animations/male_aniamtion/Talking_2.fbx");
useFBX.preload("/animations/male_aniamtion/Waving.fbx");
useFBX.preload("/animations/Standing Greeting.fbx");
