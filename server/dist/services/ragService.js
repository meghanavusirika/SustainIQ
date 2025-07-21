"use strict";
// RAG Service for ESG Report Chat
// Uses HuggingFace for embeddings and text generation
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDocument = processDocument;
exports.findRelevantChunks = findRelevantChunks;
exports.generateResponse = generateResponse;
exports.createChatSession = createChatSession;
exports.addMessageToSession = addMessageToSession;
exports.getChatSession = getChatSession;
exports.getAllChatSessions = getAllChatSessions;
// In-memory storage (replace with database in production)
const documentChunks = new Map();
const chatSessions = new Map();
async function processDocument(documentId, text) {
    // Split text into chunks (simple approach - can be enhanced with semantic splitting)
    const chunks = splitTextIntoChunks(text, 500); // 500 characters per chunk
    const documentChunksList = chunks.map((chunk, index) => ({
        id: `${documentId}_chunk_${index}`,
        content: chunk,
        metadata: {
            page: Math.floor(index / 3) + 1, // Approximate page number
            section: getSectionFromContent(chunk),
            timestamp: new Date().toISOString()
        }
    }));
    documentChunks.set(documentId, documentChunksList);
}
function splitTextIntoChunks(text, chunkSize) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks = [];
    let currentChunk = '';
    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        }
        else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
    }
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}
function getSectionFromContent(content) {
    // Simple section detection based on keywords
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('executive summary') || lowerContent.includes('overview')) {
        return 'Executive Summary';
    }
    else if (lowerContent.includes('environmental') || lowerContent.includes('climate')) {
        return 'Environmental';
    }
    else if (lowerContent.includes('social') || lowerContent.includes('community')) {
        return 'Social';
    }
    else if (lowerContent.includes('governance') || lowerContent.includes('board')) {
        return 'Governance';
    }
    else if (lowerContent.includes('risk') || lowerContent.includes('compliance')) {
        return 'Risk & Compliance';
    }
    else {
        return 'General';
    }
}
async function findRelevantChunks(documentId, query, limit = 3) {
    const chunks = documentChunks.get(documentId);
    if (!chunks)
        return [];
    // Simple keyword-based relevance scoring
    const queryWords = query.toLowerCase().split(/\s+/);
    const scoredChunks = chunks.map(chunk => {
        const content = chunk.content.toLowerCase();
        let score = 0;
        for (const word of queryWords) {
            if (content.includes(word)) {
                score += 1;
            }
        }
        return { chunk, score };
    });
    // Sort by score and return top chunks
    return scoredChunks
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.chunk);
}
async function generateResponse(query, relevantChunks) {
    // Create context from relevant chunks
    const context = relevantChunks.map(chunk => chunk.content).join('\n\n');
    // Create prompt for HuggingFace
    const prompt = `Based on the following ESG report context, please answer the user's question. If the information is not available in the context, say so.

Context:
${context}

User Question: ${query}

Answer:`;
    try {
        // Use HuggingFace for text generation (using a simple completion model)
        const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 200,
                    temperature: 0.7,
                    do_sample: true
                }
            })
        });
        const data = await response.json();
        if (data && data[0] && data[0].generated_text) {
            // Extract the generated response
            const generatedText = data[0].generated_text;
            const answer = generatedText.replace(prompt, '').trim();
            return answer || "I couldn't find specific information about that in the ESG report. Could you please rephrase your question or ask about a different aspect of the report?";
        }
        else {
            // Fallback response
            return "Based on the ESG report, I can see information about various sustainability initiatives. However, I couldn't find specific details about your question. Could you please ask about environmental performance, social responsibility, governance practices, or other ESG-related topics covered in the report?";
        }
    }
    catch (error) {
        console.error('Error generating response:', error);
        return "I'm having trouble processing your question right now. Please try again or ask about a different aspect of the ESG report.";
    }
}
function createChatSession(documentId) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session = {
        id: sessionId,
        documentId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    chatSessions.set(sessionId, session);
    return sessionId;
}
function addMessageToSession(sessionId, role, content) {
    const session = chatSessions.get(sessionId);
    if (!session)
        return;
    const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role,
        content,
        timestamp: new Date().toISOString()
    };
    session.messages.push(message);
    session.updatedAt = new Date().toISOString();
}
function getChatSession(sessionId) {
    return chatSessions.get(sessionId) || null;
}
function getAllChatSessions() {
    return Array.from(chatSessions.values());
}
