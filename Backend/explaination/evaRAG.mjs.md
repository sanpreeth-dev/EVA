# evaRAG.mjs

The Retrieval-Augmented Generation (RAG) engine that allows EVA to recall information from her knowledge base.

## Workflow
1. **Embedding**: Uses Gemini's `gemini-embedding-001` model to convert the user's query into a mathematical vector.
2. **Search**: Connects to MongoDB Atlas and performs a "Vector Search" across the `knowledges` collection.
3. **Retrieval**: Finds the top 3 most relevant snippets from `eva.md` (which have been pre-indexed).
4. **Context Injection**: Returns these snippets to the chat router, which passes them to the main Gemini LLM. This ensures EVA answers questions about her creators and mission with 100% accuracy based on the provided documentation.
