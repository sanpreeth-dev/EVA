const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const auth=require("./middleware/auth")
const http = require('http'); // 1. Import HTTP
const { Server } = require('socket.io'); // 2. Import Socket.io


// Load environment variables
dotenv.config({ path: path.join(__dirname, '../config/dev.env') });
require('./db/mongoose');

const app = express();
const server = http.createServer(app); // 3. Create Server instance
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    // Allow all origins for testing/Postman
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat')(io); // 4. Pass 'io' instance to the router

app.get('/', (req, res) => {
    res.send("Server is running");
});

app.use(userRouter);
app.use('/api', chatRouter);

// Start Server using 'server.listen' instead of 'app.listen'
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});