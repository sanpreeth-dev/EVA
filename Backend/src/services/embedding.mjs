import mongoose from "mongoose";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"; // <--- BACK TO KNOWN WORKING SPLITTER
import * as fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Import your CommonJS model into this ESM file
import Knowledge from "../models/knowledge.js"; 

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), "config/dev.env") });

const seed = async () => {
  try {
    // 1. Connect
    if (!process.env.Mongo_URL) throw new Error("❌ MONGODB_URL is missing");
    await mongoose.connect(process.env.Mongo_URL);
    console.log("🔌 Connected to MongoDB");

    // 2. Clear old data
    await Knowledge.deleteMany({});
    console.log("🧹 Cleared old knowledge");

    // 3. Read & Split using Recursive Character Splitter (Fallback)
    const filePath = path.join(process.cwd(), "eva.md");
    const text = fs.readFileSync(filePath, "utf8");

    // "MarkdownTextSplitter" is a subclass of RecursiveCharacterTextSplitter optimized for MD
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["\n## ", "\n# ", "\n\n", "\n", " "] 
    });

    const docs = await splitter.createDocuments([text]);
    console.log(`📄 Parsed eva.md into ${docs.length} chunks`); 
    
    // 4. Generate Embeddings
    console.log("🧠 Generating Embeddings with Gemini...");
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: process.env.GEMINI_API_KEY,
    });

    const textStrings = docs.map(d => d.pageContent);
    const vectors = await embeddings.embedDocuments(textStrings);

    console.log("🧪 Testing embedQuery in this same script...");
    try {
      const queryVector = await embeddings.embedQuery("Hello world");
      console.log("✅ embedQuery worked here!");
    } catch (e) {
      console.error("❌ embedQuery failed even here:", e);
    }

    // 5. Prepare Data
    const knowledgeEntries = docs.map((doc, index) => ({
      text: doc.pageContent,
      embedding: vectors[index],
      metadata: { source: "eva.md", ...doc.metadata } 
    }));

    // 6. Save
    await Knowledge.insertMany(knowledgeEntries);
    console.log(`✅ Successfully saved ${knowledgeEntries.length} entries to Atlas!`);

  } catch (err) {
    console.error("❌ Seeding Failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Connection closed");
  }
};

seed();