const mongoose = require("mongoose")

const knowledgeSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    embedding: {
        type: [Number], 
        required: true
    },
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
})

const Knowledge = mongoose.model("knowledge", knowledgeSchema)
module.exports = Knowledge