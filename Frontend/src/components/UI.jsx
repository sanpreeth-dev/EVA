import React, { useRef, useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import CameraModal from "./Modals/CameraModal";
import { Link } from "react-router-dom";
import { Camera, Send, Home, MessageSquare, Maximize, Minimize } from "lucide-react";

const KaraokeText = ({ text, currentAudioTime, totalAudioDuration }) => {
  if (!text) return null;

  // Progress ratio (0 to 1)
  const progressRatio = totalAudioDuration > 0 ? Math.min(1, currentAudioTime / totalAudioDuration) : 0;

  // Predict how many characters should be highlighted
  const highlightLimit = text.length * progressRatio;

  // Split into words while keeping whitespace for layout preservation
  const tokens = text.split(/(\s+)/);
  let cumulativeLength = 0;

  return (
    <p className="font-medium text-lg leading-relaxed select-none">
      {tokens.map((token, index) => {
        const tokenStart = cumulativeLength;
        cumulativeLength += token.length;

        // Determine highlighting state for this token
        // Use purple (#9333ea) for highlighted, gray (#9ca3af) otherwise
        const isHighlighted = tokenStart < highlightLimit;
        const color = isHighlighted ? "#9333ea" : "#9ca3af";

        return (
          <span
            key={index}
            style={{
              color,
              transition: 'color 0.2s ease-in-out'
            }}
          >
            {token}
          </span>
        );
      })}
    </p>
  );
};

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message, isSpeaking, currentAudioTime, totalAudioDuration, playIntro, avatar } = useChat();
  const [showCameraModal, setShowCameraModal] = useState(false);

  useEffect(() => {
    // Only play intro if we haven't played it in this session for this avatar
    const storageKey = `intro_played_${avatar.name}`;
    if (sessionStorage.getItem(storageKey)) return;

    // Play intro wave after a short delay so the user can see it
    const timer = setTimeout(() => {
      playIntro();
      sessionStorage.setItem(storageKey, "true");
    }, 1000);
    return () => clearTimeout(timer);
  }, [avatar.name]);

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };

  const handleImageCapture = (imageDataUrl, messageText) => {
    // Triggers EVA to respond to the shared expression/mood with the user's message
    chat(messageText || "");
  };

  if (hidden) {
    return null;
  }

  return (
    <>
      {/* Conditionally render the camera modal */}
      {showCameraModal && (
        <CameraModal
          onClose={() => setShowCameraModal(false)}
          onImageCapture={handleImageCapture}
        />
      )}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-6 flex-col pointer-events-none">

        {/* Header / Brand */}
        <div className="self-start backdrop-blur-xl bg-white/60 border border-white/50 p-4 rounded-2xl shadow-lg pointer-events-auto transition-all hover:bg-white/70">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">{avatar.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800 leading-none">{avatar.name}</h1>
              <p className="text-xs text-purple-600 font-medium">Your AI Companion</p>
            </div>
          </div>

          <Link to="/" className="w-full">
            <button className="w-full mt-2 flex items-center justify-center gap-2 bg-white/50 hover:bg-white/80 text-gray-700 py-2 px-4 rounded-xl transition-all border border-white/40 shadow-sm hover:shadow text-sm font-medium">
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </Link>
        </div>

        {/* Sidebar Tools (Right Side) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto z-20">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="p-4 bg-white/60 backdrop-blur-xl hover:bg-purple-50 text-gray-700 hover:text-purple-600 rounded-2xl transition-all border border-white/50 shadow-2xl group"
            title={cameraZoomed ? "Zoom Out" : "Zoom In"}
          >
            {cameraZoomed ? (
              <Minimize className="w-7 h-7 transition-transform group-hover:scale-110" />
            ) : (
              <Maximize className="w-7 h-7 transition-transform group-hover:scale-110" />
            )}
          </button>
        </div>


        {/* Chat Area */}
        <div className="flex flex-col gap-4 pointer-events-auto w-full max-w-3xl mx-auto">

          {/* EVA's Response Message */}
          {message && (
            <div className="animate-fade-in-up mb-2 self-center w-full">
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-xl relative">
                {/* Little tail/arrow (optional styling preference) */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/70 rotate-45 border-r border-b border-white/60"></div>

                <div className="relative z-10 flex items-start gap-4">
                  <div className="p-2 bg-purple-100 rounded-full shrink-0">
                    <MessageSquare className="w-6 h-6 text-purple-500" />
                  </div>
                  <KaraokeText text={message.text} currentAudioTime={currentAudioTime} totalAudioDuration={totalAudioDuration} />
                </div>
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl border border-white/50 p-2 rounded-2xl shadow-2xl">
            {/* Camera Button */}
            <button
              onClick={() => setShowCameraModal(true)}
              className="p-3 bg-white/60 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-xl transition-all border border-white/40 shadow-sm"
              title="Analyze an image"
            >
              <Camera className="w-6 h-6" />
            </button>

            {/* Text Input */}
            <input
              className="flex-1 bg-transparent p-3 text-gray-800 placeholder:text-gray-500 placeholder:font-light outline-none text-lg"
              placeholder="Type a message to EVA..."
              ref={input}
              disabled={showCameraModal}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !showCameraModal) {
                  sendMessage();
                }
              }}
              autoFocus
            />

            {/* Send Button */}
            <button
              disabled={loading || message || showCameraModal}
              onClick={sendMessage}
              className={`p-3 px-6 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2 ${loading || message || showCameraModal
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                }`}
            >
              <span className="hidden sm:inline">Send</span>
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
