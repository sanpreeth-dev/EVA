const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "model", "system"], 
        required: true,
    },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    summary: { type: String, trim: true },
    messages: [messageSchema], 
    isActive: { type: Boolean, default: true },
    
    // 🆕 SLIDING WINDOW FLAG
    // false = Recent Context (Gemini reads this directly)
    // true = Deep Memory (Already merged into Bio, Gemini ignores this)
    isArchived: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true,
});

// Optimization: Quickly find active chats OR recent un-archived summaries
chatHistorySchema.index({ userId: 1, isActive: 1, isArchived: 1 });

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
module.exports = ChatHistory;