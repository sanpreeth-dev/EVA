import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, X, RefreshCw, Check, Image as ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { useChat } from "../../hooks/useChat";

export default function CameraModal({ onClose, onImageCapture }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [message, setMessage] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { detectEmotion, detectedEmotion, loading, setDetectedEmotion } = useChat();

  // Starts the user's webcam and displays the stream.
  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setShowWebcam(true);
    } catch (err) {
      console.error("Error accessing webcam: ", err);
      // Ideally use a toast here
      alert("Could not access the webcam. Please check your browser permissions.");
      onClose();
    }
  };

  // Effect to attach the stream to the video element when it's ready.
  useEffect(() => {
    if (showWebcam && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [showWebcam, stream]);

  // Effect to clean up the webcam stream when the component unmounts or stream changes.
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Captures a frame from the video stream and displays it for preview.
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(imageDataUrl);
      setShowWebcam(false); // Hide webcam, show preview
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  // Handles the file selection from the disk.
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCapturedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Programmatically clicks the hidden file input.
  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  // Sends the captured image data to the parent component.
  const handleSendImage = () => {
    onImageCapture(capturedImage, message);
    onClose();
  };

  // Resets the modal to the initial selection state.
  const resetCapture = () => {
    setCapturedImage(null);
    setShowWebcam(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setDetectedEmotion(null);
    setMessage("");
  };

  const compressImage = (base64Str, maxWidth = 640) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Use PNG for lossless quality to help face detection
        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  const handleAnalyzeEmotion = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (capturedImage) {
      // Compress image before sending to backend to save bandwidth
      const compressed = await compressImage(capturedImage);
      detectEmotion(compressed);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative animate-scale-in pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onClose(); }}
          className="absolute top-4 right-4 p-2 bg-gray-100/50 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {capturedImage ? "Preview Image" : showWebcam ? "Take a Photo" : "Share an Image"}
        </h2>

        {capturedImage ? (
          // View for previewing the captured or uploaded image
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-purple-100 shadow-inner bg-gray-50">
              <img src={capturedImage} alt="Preview" className="w-full h-full object-contain" />

              {/* Emotion Badge */}
              {detectedEmotion && (
                <div className="absolute top-4 left-4 animate-bounce">
                  <div className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-purple-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-wider text-sm">
                      {detectedEmotion === 'no_face' ? 'No Face Detected' : `Feeling ${detectedEmotion}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full flex flex-col gap-3">
              {!detectedEmotion && (
                <button
                  type="button"
                  onClick={handleAnalyzeEmotion}
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  {loading ? "Analyzing..." : "Analyze My Expression"}
                </button>
              )}

              <div className="flex gap-4 w-full">
                <button
                  type="button"
                  onClick={resetCapture}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Retake
                </button>
                <button
                  type="button"
                  onClick={handleSendImage}
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    }`}
                >
                  <Check className="w-5 h-5" />
                  Send
                </button>
              </div>

              {/* Message Input */}
              <div className="w-full mt-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendImage()}
                  placeholder="Add a message (optional)..."
                  className="w-full p-4 rounded-xl bg-gray-100 border-2 border-transparent focus:border-purple-200 focus:bg-white outline-none transition-all text-gray-800"
                  autoFocus
                />
              </div>
            </div>
          </div>
        ) : showWebcam ? (
          // View for the live webcam feed
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border-2 border-purple-200 shadow-lg">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => {
                  setShowWebcam(false);
                  if (stream) stream.getTracks().forEach(t => t.stop());
                }}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCapture}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Capture
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
        ) : (
          // Initial view with options to take or upload a photo
          <div className="flex flex-col gap-4 my-2">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); startWebcam(); }}
              className="group w-full py-6 px-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 transition-all flex items-center justify-center gap-4 shadow-sm hover:shadow-md"
            >
              <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-lg">Use Camera</span>
                <span className="text-sm opacity-70">Take a photo right now</span>
              </div>
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); triggerFileUpload(); }}
              className="group w-full py-6 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-all flex items-center justify-center gap-4 shadow-sm hover:shadow-md"
            >
              <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-lg">Upload File</span>
                <span className="text-sm opacity-70">Choose from your device</span>
              </div>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          </div>
        )}
      </div>
    </div>
  );
}
