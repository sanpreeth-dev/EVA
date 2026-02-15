const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../models/history'); 
const User = require('../models/users'); 
const LongMemory = require('../models/LongMemory'); // 👈 THIS WAS THE MISSING PIECE
const { generateAudio } = require('../services/speak'); // 🔊 Import Audio Service
const { detectEmotion } = require('../services/emotionService'); // 🧠 Import FER Service

// 🚀 RAG INTEGRATION
let retrieveContext;
import('../services/evaRAG.mjs').then(module => {
    retrieveContext = module.retrieveContext;
}).catch(err => console.error("❌ Failed to load RAG module:", err));

module.exports = function(io) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ==========================================
    // 🎛️ FLEET CONFIGURATION (Restored Your Models)
    // ==========================================
    const IS_PRESENTATION_MODE = true; 
    
    // ✅ Using the models you specified
    const TEST_FLEET = ["gemma-3-27b-it", "gemma-3-12b-it"];
    const PRESENTATION_FLEET = ["gemini-2.5-flash-lite", "gemini-2.5-flash","gemini-2.5-pro"];
    const ACTIVE_FLEET = IS_PRESENTATION_MODE ? PRESENTATION_FLEET : TEST_FLEET;
    // ==========================================

    io.on('connection', async (socket) => {
        const userId = socket.handshake.query.userId;
        const modeName = IS_PRESENTATION_MODE ? "PRESENTATION 👔" : "TESTING 🧪";
        console.log(`✅ Client Connected (${modeName}): ${socket.id}`);
        console.log(`🔍 User ID: ${userId}`);

        // ==========================================
        // 🧠 MEMORY LOADING (The Logic Fix)
        // ==========================================
        let userName = "Friend";
        let userBio = "This is a new user."; // 1. Deep Past (Bio)
        let recentSummaries = "No recent conversations."; // 2. Recent Past (Summaries)

        if (userId) {
            try {
                // A. Identity
                const userProfile = await User.findById(userId);
                if (userProfile) userName = userProfile.username;

                // B. Deep Memory (The specific fix for "Who am I?")
                const longMem = await LongMemory.findOne({ userId: userId });
                if (longMem && longMem.bio) {
                    userBio = longMem.bio;
                }

                // C. Short Term Memory (Last 3 sessions)
                const pastSessions = await ChatHistory.find({ userId: userId, isActive: false })
                    .sort({ createdAt: -1 }) 
                    .limit(3) 
                    .select('summary');

                if (pastSessions.length > 0) {
                    recentSummaries = pastSessions.map(s => `• ${s.summary}`).join("\n");
                }
            } catch (e) { console.error("Memory Load Error:", e); }
        }

        // ==========================================
        // 🤖 SYSTEM INSTRUCTION (Static Context)
        // ==========================================
        const SYSTEM_INSTRUCTION = `
        ROLE: You are EVA, an Emotional Virtual Assistant.
        
        [USER PROFILE]:
        Name: ${userName}
        Life Story / Bio: "${userBio}"
        
        [RECENT CONVERSATION HISTORY]:
        ${recentSummaries}
        
        CORE RULES:
        1. Reply in 2-3 sentences max. Conversational tone.
        2. If a [USER EMOTION] is provided in the prompt, you MUST acknowledge it immediately. 
        3. Be empathetic. If they look sad, happy, or surprised, ask them why they feel that way.
        4. If the user asks "Who am I?", use the [USER PROFILE].
        5. If the user asks for advice, use the [KNOWLEDGE BASE] provided in the prompt.
        `;

        // 1️⃣ LOAD ACTIVE CHAT HISTORY
        let dbHistory = [];
        let chatSession = null;

        if (userId) {
            try {
                chatSession = await ChatHistory.findOne({ userId: userId, isActive: true });
                if (!chatSession) {
                    chatSession = new ChatHistory({ userId: userId, messages: [] });
                    await chatSession.save();
                }
                dbHistory = chatSession.messages.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }));
            } catch (err) { console.error("DB Load Error:", err); }
        }

        // --- EMOTION DETECTION EVENT ---
        socket.on('detect_emotion', async (data) => {
            console.log("📸 Received image for emotion detection");
            try {
                // We could force a check here if needed, but for now let's just use it
                const emotion = await detectEmotion(data.image);
                socket.emit('emotion_detected', { emotion });
            } catch (err) {
                console.error("Emotion Detection Error:", err);
                socket.emit('emotion_detected', { emotion: 'unknown' });
            }
        });

        socket.on('user_message', async (data) => {
            console.log(`\n📩 New Message from ${socket.id}: "${data.text}"`);
            console.log(`🎤 Received Data:`, JSON.stringify(data));
            console.log(`📜 Current History Length: ${dbHistory.length}`);
            const userText = data.text;
            let success = false;
            let currentModelIndex = 0;

            // 2️⃣ RETRIEVE RAG CONTEXT
            let ragData = "";
            if (retrieveContext) {
                try { ragData = await retrieveContext(userText); } 
                catch (e) { console.error("RAG Error:", e); }
            }

            // 3️⃣ CONSTRUCT PROMPT
            const emotionContext = data.emotion 
                ? `[USER EMOTION]: The user looks ${data.emotion} right now. Acknowledge this and ask them: "Why are you feeling ${data.emotion}? Could you tell me more about it?"\n` 
                : "";
            
            const promptWithContext = `
            ${emotionContext}
            [KNOWLEDGE BASE (Scientific/Medical Info)]:
            ${ragData || "No specific medical context found."}

            [USER MESSAGE]:
            ${userText || "(User shared their expression with you)"}
            `;

            // 4️⃣ FLEET RETRY LOOP
            while (!success && currentModelIndex < ACTIVE_FLEET.length) {
                const modelName = ACTIVE_FLEET[currentModelIndex];
                
                try {
                    console.log(`🤖 Using Model: ${modelName}`);

                    // 🚨 GEMMA COMPATIBILITY FIX 🚨
                    // Gemma models don't support `systemInstruction` via API yet.
                    // We must manually inject it into the prompt.
                    const isGemma = modelName.includes("gemma");
                    
                    let model;
                    let finalPrompt = promptWithContext;

                    if (isGemma) {
                        // A. GEMMA MODE (Manual Injection)
                        model = genAI.getGenerativeModel({ model: modelName });
                        
                        // We prepend the System ID to the very first message effectively
                        finalPrompt = `
                        ${SYSTEM_INSTRUCTION}
                        
                        ${promptWithContext}
                        `;
                    } else {
                        // B. GEMINI MODE (Standard API)
                        model = genAI.getGenerativeModel({ 
                            model: modelName,
                            systemInstruction: SYSTEM_INSTRUCTION 
                        });
                    }
                    
                    const chat = model.startChat({ history: dbHistory });

                    const result = await chat.sendMessageStream(finalPrompt);
                    
                    let fullResponse = "";
                    for await (const chunk of result.stream) {
                        const textChunk = chunk.text();
                        fullResponse += textChunk;
                        socket.emit('ai_response', { text: textChunk });
                    }
                    socket.emit('ai_response_end');
                    success = true; 

                    // 🔊 GENERATE AUDIO & LIP SYNC
                    const voiceId = data.voiceId; 
                    //const audioBase64 = await generateAudio(fullResponse, voiceId);
                     const audioBase64 = null; // Mock audio to save credits
                    const { generateLipSync } = require('../services/lipSync');
                    const lipsyncData = generateLipSync(fullResponse);

                    // Determine facial expression based on basic sentiment (rudimentary)
                    let facialExpression = 'smile';
                    let animation = 'Idle';
                    const lowerResp = fullResponse.toLowerCase();
                    if(lowerResp.includes("sorry") || lowerResp.includes("sad")) {
                        facialExpression = 'sad';
                    } else if (lowerResp.includes("wow") || lowerResp.includes("amazing")) {
                        facialExpression = 'surprised';
                    }

                    socket.emit('ai_audio_response', {
                        text: fullResponse, // Send the full text response
                        audio: audioBase64,
                        lipsync: lipsyncData,
                        facialExpression: facialExpression,
                        animation: animation
                    }); 

                    // 5️⃣ SAVE TO MONGODB
                    if (chatSession) {
                        // Use a space for empty text to satisfy Schema validation (text: { required: true })
                        const saveText = userText && userText.trim() ? userText : " ";
                        
                        chatSession.messages.push({ role: 'user', text: saveText });
                        chatSession.messages.push({ role: 'model', text: fullResponse });
                        
                        dbHistory.push({ role: 'user', parts: [{ text: saveText }] });
                        dbHistory.push({ role: 'model', parts: [{ text: fullResponse }] });
                        
                        await chatSession.save();
                        console.log(`💾 Session Saved. New History Length: ${dbHistory.length}`);
                    }

                } catch (error) {
                    console.error(`⚠️ Error with ${modelName}:`, error.message);
                    currentModelIndex++; 
                }
            }

            if (!success) {
                socket.emit('error', { message: 'EVA is currently overwhelmed. Please try again.' });
            }
        });

        socket.on('disconnect', () => console.log("❌ Client Disconnected"));
    });

    return router;
};