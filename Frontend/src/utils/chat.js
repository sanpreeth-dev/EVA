import { io } from 'socket.io-client';

// ✅ FIX: Changed 5000 to 3000 to match your Node.js server port
const BASE_URL = "http://localhost:5000";

// Standard HTTP Fetch for Chat Status
export async function fetchChatStatus({ signal }) {
  const response = await fetch(`${BASE_URL}/chat-status`, { signal });

  if (!response.ok) {
    const error = new Error('Chat system is unreachable');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json(); 
}

// WebSocket Manager
export const chatSocket = io(BASE_URL, {
  autoConnect: false, // ⚡ CRITICAL: Keeps socket idle until ChatPage injects the UserID
  transports: ['websocket'] // Optional: Forces modern, faster connection
});

// Helper to emit messages
export const sendChatMessage = (text) => {
  if (chatSocket.connected) {
    chatSocket.emit('user_message', { text });
  } else {
    console.error("⚠️ Cannot send message: Socket not connected.");
  }
};