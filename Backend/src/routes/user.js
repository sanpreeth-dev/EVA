const express=require("express")
const cron = require('node-cron');

const router= new express.Router()

const auth = require("../middleware/auth")
const USER=require("../models/users")
const History=require("../models/history")
const LongMemory=require('../models/LongMemory')
const { compressSession,runDailyBatchUpdate, cleanupOldArchives } = require('../services/history');


router.post("/users", async (req, res) => {
    try {
        const user = new USER(req.body);
        
        // 1. Generate the token (this adds it to the user.tokens array in memory)
        const token = await user.makeToken(); 
        
        // 2. Perform ONE save (this triggers the password hash + saves the token)
        // REMOVED REDUNDANT SAVE: await user.save();
        
        res.status(201).send({ user, token });
    } catch (e) {
        // Handle Duplicate User Error
        if (e.code === 11000) {
            return res.status(400).send({ error: "Username or Email already taken" });
        }

        // LOG THIS to see the exact field that failed (username, password, or token)
        console.error("Signup Error:", e.message); 
        res.status(400).send({ error: e.message });
    }
});

router.post("/users/login",async(req,res)=>{
    try{
        const user= await USER.findByCredentials(req.body.username,req.body.password)
        const token = await user.makeToken()
        res.send({user,token})
    }
    catch(e){
        res.status(400).send({error:"No user found"})
    }
})

router.get("/users/history",auth, async (req, res) => {
    try {
        const userHistory = await History.find({ userId: req.user._id });

        if (userHistory.length===0) {
            return res.status(404).send({ message: "No history found." });
        }

        res.status(200).send(userHistory);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        // 🧠 1. Compress the current session before killing the token
        await compressSession(req.user._id);

        // 2. Standard Logout
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();

        res.send({ message: "Logged out & Memory Saved" });
    } catch (e) {
        res.status(500).send();
    }
});

// 1. Nightly Memory Update (Midnight)
cron.schedule('0 0 * * *', () => {
    console.log("⏰ Triggering Nightly Memory Update from User Routes...");
    runDailyBatchUpdate();
});

// 2. Data Retention Cleanup (1:00 AM)
cron.schedule('0 1 * * *', () => {
    console.log("🧹 Triggering Data Retention Cleanup...");
    cleanupOldArchives();
});

router.get('/test-memory-update', async (req, res) => {
    console.log("🧪 Manually triggering batch update...");
    await runDailyBatchUpdate();
    res.send("Batch update triggered! Check your server terminal logs.");
});

router.get('/test-cleanup', async (req, res) => {
    console.log("🧪 Manually triggering data cleanup...");
    const result = await cleanupOldArchives();
    res.send(`Cleanup triggered! Deleted ${result?.deletedCount || 0} old records.`);
});

router.get("/users/context", auth, async (req, res) => {
    try {
        const memory = await LongMemory.findOne({ userId: req.user._id });

        if (!memory) {
            // Default response if the Cron Job hasn't run yet for a new user
            return res.send({
                bio: "EVA is still getting to know you. Chat more to see your personal summary here! or Insert your own data",
                lastUpdated: null
            });
        }

        res.send(memory);
    } catch (e) {
        res.status(500).send({ error: "Could not fetch context" });
    }
});

router.patch("/users/context", auth, async (req, res) => {
    try {
        const { bio } = req.body;
        
        let memory = await LongMemory.findOne({ userId: req.user._id });

        if (!memory) {
            // Create if not exists
            memory = new LongMemory({
                userId: req.user._id,
                bio: bio
            });
        } else {
            // Update existng
            memory.bio = bio;
        }

        await memory.save();
        res.send(memory);
    } catch (e) {
        res.status(400).send({ error: "Could not update context" });
    }
});

module.exports=router