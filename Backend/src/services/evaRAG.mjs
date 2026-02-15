import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";

// 1. Load your .env file
dotenv.config({ path: path.resolve(process.cwd(), "config/dev.env") });

const client = new MongoClient(process.env.Mongo_URL);

// ⚠️ SETTINGS: Check these match your Atlas setup
const DB_NAME = "eva";               
const COLLECTION_NAME = "knowledges"; 
const INDEX_NAME = "Knowledge_Index";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GEMINI_API_KEY,
});

export const retrieveContext = async (query) => {
  try {
    console.log(`🧠 retrieveContext called for: "${query.substring(0, 20)}..."`);
    
    if (!query || query.trim().length === 0) {
      console.log("Empty query, skipping search.");
      return "";
    }
    
    // Patch inside the call to be extra sure
    embeddings.embedQuery = async (queryText) => {
      console.log(`🛠️ Patch active for: "${queryText.substring(0, 20)}..."`);
      const res = await embeddings.embedDocuments([queryText]);
      console.log(`📊 Vector retrieved, size: ${res[0].length}`);
      return res[0];
    };

    // 2. Connect to Mongo
    await client.connect();
    const collection = client.db(DB_NAME).collection(COLLECTION_NAME);

    // 3. Initialize the Vector Store Wrapper
    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection: collection,
      indexName: INDEX_NAME, 
      textKey: "text", 
      embeddingKey: "embedding",
    });

    // 4. Perform the Search
    // "Find the 3 most similar chunks to the user's query"
    console.log(`🔍 Searching Brain for: "${query}"...`);
    const results = await vectorStore.similaritySearch(query, 3);
    
    if (results.length === 0) {
      console.log("⚠️ No relevant matches found in memory.");
      return "";
    }

    console.log(`✅ Found ${results.length} matches.`);
    
    // 5. Return the text content
    return results.map(r => r.pageContent).join("\n\n");

  } catch (error) {
    console.error("❌ RAG Retrieval Failed:", error);
    return ""; // Return empty string so chat can continue without context
  }
  // Note: We don't close the client here intentionally so it stays warm for the next request.
};