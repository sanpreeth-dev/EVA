const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatHistory = require("../models/history");
const LongMemory = require("../models/LongMemory");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use your preferred model (Flash is best for background tasks)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ==========================================
// 1. COMPRESS SESSION (Runs when user leaves)
// ==========================================
async function compressSession(userId) {
  try {
    const chat = await ChatHistory.findOne({ userId: userId, isActive: true });

    if (!chat) return; // No active chat
    
    // Safety: Don't summarize empty chats
    if (chat.messages.length === 0) {
      chat.isActive = false;
      await chat.save();
      return console.log("ℹ️ Session empty. Closed without summary.");
    }

    // A. Generate Summary
    const transcript = chat.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n");

    const prompt = `Summarize this chat in 2 sentences. Focus on facts and user's mood.\nTRANSCRIPT:\n${transcript}\nSUMMARY:`;

    const result = await model.generateContent(prompt);
    const summaryText = result.response.text();

    // B. Wipe Messages, Keep Summary
    chat.summary = summaryText;
    chat.messages = [];     // 🗑️ Delete raw messages to save space
    chat.isActive = false;  // 🔒 Close session
    chat.isArchived = false;// ✨ Keep strictly "False" so it stays in Short Term Memory for now
    await chat.save();

    // C. Initialize LongMemory if missing
    const hasMemory = await LongMemory.exists({ userId });
    if (!hasMemory) {
      await new LongMemory({ userId, bio: "EVA is still getting to know you. Chat more to see your personal summary here! or Insert your own data" }).save();
    }

    console.log(`✅ Session compressed for ${userId}`);
    return summaryText;

  } catch (error) {
    console.error("❌ Memory compression failed:", error);
  }
}

// ==========================================
// 2. NIGHTLY BATCH (The Sliding Window)
// ==========================================
async function runDailyBatchUpdate() {
  console.log("🌙 Starting Sliding Window Consolidation...");

  // Define the "Window" (3 Days)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  // 1. Get all users who have a Bio
  const profiles = await LongMemory.find({});

  for (const profile of profiles) {
    try {
      // 2. Find chats that are OLD (> 3 days) but NOT yet merged (isArchived: false)
      const chatsToArchive = await ChatHistory.find({
        userId: profile.userId,
        isActive: false,
        isArchived: false,         // Only process fresh ones
        updatedAt: { $lt: threeDaysAgo } // Only process OLD ones
      }).select("summary");

      if (chatsToArchive.length === 0) continue; // Nothing to do for this user

      console.log(`Processing ${chatsToArchive.length} old chats for ${profile.userId}...`);

      // 3. Prepare the Merge Prompt
      const oldSummaries = chatsToArchive.map(c => `- ${c.summary}`).join("\n");
      const currentBio = profile.bio || "EVA is still getting to know you. Chat more to see your personal summary here! or Insert your own data";

      const prompt = `
            You are EVA's Memory Manager.
            We are moving old specific details into the User's Permanent Biography.
            
            [CURRENT BIO]: "${currentBio}"
            
            [OLD MEMORIES TO MERGE]:
            ${oldSummaries}
            
            INSTRUCTIONS:
            1. Update the Bio to include important facts from the Old Memories.
            2. Generalize specific events (e.g., "Ate pizza on Tuesday" -> "Likes pizza").
            3. Keep the tone warm and personal ("You...").
            4. Max Length: 200 words.
            
            UPDATED BIO:`;

      const result = await model.generateContent(prompt);
      const newBio = result.response.text();

      // 4. Update Database
      // A. Update Bio
      profile.bio = newBio;
      profile.lastUpdated = new Date();
      await profile.save();

      // B. "Soft Delete" the processed chats (Mark as Archived)
      const chatIds = chatsToArchive.map(c => c._id);
      await ChatHistory.updateMany(
        { _id: { $in: chatIds } }, 
        { $set: { isArchived: true } }
      );

      console.log(`✅ Merged ${chatsToArchive.length} chats into Bio for ${profile.userId}`);

    } catch (error) {
      console.error(`❌ Batch failed for ${profile.userId}:`, error.message);
    }
  }
  console.log("🌙 Nightly Batch Complete.");
}

/**
 * 🗑️ DATA RETENTION POLICY
 * Deletes archived history that is older than 5 days.
 * Kept separate from the daily update to segregate responsibilities.
 */
async function cleanupOldArchives() {
    console.log("🧹 Starting 5-Day Data Retention Cleanup...");
    
    try {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        // Delete docs that are BOTH archived AND haven't been touched in 5 days
        const result = await ChatHistory.deleteMany({
            isArchived: true,
            updatedAt: { $lt: fiveDaysAgo }
        });

        console.log(`🗑️ Cleanup Complete. Deleted ${result.deletedCount} old archived sessions.`);
        return result;

    } catch (e) {
        console.error("❌ Cleanup Failed:", e);
    }
}

module.exports = { compressSession, runDailyBatchUpdate, cleanupOldArchives };