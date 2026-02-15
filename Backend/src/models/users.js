const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        trim: true,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true
});

// 🔗 Virtual Link to Chat History
userSchema.virtual('chats', {
    ref: 'ChatHistory',     // Matches the model name in History.js
    localField: '_id',      
    foreignField: 'userId'  
});

// 🔒 SECURITY METHOD: Hide Private Data
// This runs automatically whenever you do res.send(user)
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password; // Never send password hash to client
    delete userObject.tokens;   // Never send access tokens array to client
    
    return userObject;
}

// 🔑 Generate Auth Token
userSchema.methods.makeToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

// 🔍 Login Logic
userSchema.statics.findByCredentials = async function (username, password) {
    const user = await this.findOne({ username });
    if (!user) {
        throw new Error("Unable to login");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error("Unable to login");
    }

    return user;
}

// 🛡️ Hash Password Before Saving
userSchema.pre('save', async function () {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    
});

const User = mongoose.model("users", userSchema);
module.exports = User;