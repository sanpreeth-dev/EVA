const mongoose = require("mongoose");

const longMemorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: "EVA is still getting to know you. Chat more to see your personal summary here! or Insert your own data",
        trim: true
    },
    // The "Timer" field - defaults to creation time
    lastUpdated: {
        type: Date,
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model("LongMemory", longMemorySchema);