import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { avatars } from "./avatarConfig";

const BACKEND_URL = "http://localhost:5000";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [cameraZoomed, setCameraZoomed] = useState(true);
    const [socket, setSocket] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentAudioTime, setCurrentAudioTime] = useState(0);
    const [totalAudioDuration, setTotalAudioDuration] = useState(0);
    const [detectedEmotion, setDetectedEmotion] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const userId = savedUser ? JSON.parse(savedUser)._id : null;

        const newSocket = io(BACKEND_URL, {
            query: { userId: userId || "" }
        });

        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("ai_response", () => {
            setLoading(false);
        });

        socket.on("ai_audio_response", (data) => {
            const newMessage = {
                text: data.text,
                audio: data.audio,
                lipsync: data.lipsync,
                facialExpression: data.facialExpression,
                animation: data.animation
            };

            setMessages((prev) => [...prev, newMessage]);
            setLoading(false);
        });

        socket.on("emotion_detected", (data) => {
            setDetectedEmotion(data.emotion);
            setLoading(false);
        });

        socket.on("error", (err) => {
            console.error("Socket Error:", err);
            setLoading(false);
        });

        return () => {
            socket.off("ai_response");
            socket.off("ai_audio_response");
            socket.off("error");
        };
    }, [socket]);

    const chat = async (text) => {
        if (!socket) return;
        setLoading(true);
        socket.emit("user_message", {
            text,
            voiceId: avatar.voiceId,
            emotion: detectedEmotion
        });
        setDetectedEmotion(null);
    };

    const detectEmotion = (imageData) => {
        if (!socket) return;
        setLoading(true);
        socket.emit("detect_emotion", { image: imageData });
    };

    const playIntro = () => {
        const introMessage = {
            text: avatar.introText,
            audio: avatar.introAudio,
            lipsync: {
                mouthCues: avatar.mouthCues
            },
            facialExpression: "smile",
            animation: "Greeting"
        };
        setMessages([introMessage]);
    };

    const onMessagePlayed = () => {
        setMessages((messages) => messages.slice(1));
    };

    useEffect(() => {
        if (messages.length > 0) {
            setMessage(messages[0]);
        } else {
            setMessage(null);
        }
    }, [messages]);

    const [avatar, setAvatar] = useState(() => {
        const saved = localStorage.getItem("avatar");
        if (saved) {
            const parsed = JSON.parse(saved);
            const official = avatars.find(a => a.name === parsed.name);
            return official || avatars[0];
        }
        return avatars[0];
    });

    useEffect(() => {
        localStorage.setItem("avatar", JSON.stringify(avatar));
    }, [avatar]);

    return (
        <ChatContext.Provider
            value={{
                chat,
                message,
                onMessagePlayed,
                loading,
                cameraZoomed,
                setCameraZoomed,
                avatar,
                setAvatar,
                avatars,
                isSpeaking,
                setIsSpeaking,
                currentAudioTime,
                setCurrentAudioTime,
                totalAudioDuration,
                setTotalAudioDuration,
                detectedEmotion,
                setDetectedEmotion,
                detectEmotion,
                playIntro
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
