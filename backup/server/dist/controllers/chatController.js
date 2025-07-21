"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSessions = exports.getChatSessionData = exports.sendMessage = exports.uploadDocumentForChat = void 0;
const pdfParser_1 = require("../services/pdfParser");
const ragService_1 = require("../services/ragService");
const uploadDocumentForChat = async (req, res) => {
    var _a;
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }
        // Extract text from PDF
        const pdfText = await (0, pdfParser_1.extractTextFromBuffer)(req.file.buffer);
        if (!pdfText || pdfText.trim().length === 0) {
            return res.status(400).json({ error: 'Could not extract text from PDF' });
        }
        // Generate document ID
        const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Process document for RAG
        await (0, ragService_1.processDocument)(documentId, pdfText);
        // Create chat session
        const sessionId = (0, ragService_1.createChatSession)(documentId);
        // Clean up uploaded file
        if (req.file.path && require('fs').existsSync(req.file.path)) {
            require('fs').unlinkSync(req.file.path);
        }
        res.json({
            success: true,
            documentId,
            sessionId,
            message: 'Document uploaded and processed successfully. You can now start chatting about it!'
        });
    }
    catch (error) {
        console.error('Error in uploadDocumentForChat:', error);
        // Clean up uploaded file on error
        if (((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) && require('fs').existsSync(req.file.path)) {
            require('fs').unlinkSync(req.file.path);
        }
        res.status(500).json({
            error: 'Failed to process document for chat',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.uploadDocumentForChat = uploadDocumentForChat;
const sendMessage = async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        if (!sessionId || !message) {
            return res.status(400).json({ error: 'Missing sessionId or message' });
        }
        const session = (0, ragService_1.getChatSession)(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Chat session not found' });
        }
        // Add user message to session
        (0, ragService_1.addMessageToSession)(sessionId, 'user', message);
        // Find relevant chunks from the document
        const relevantChunks = await (0, ragService_1.findRelevantChunks)(session.documentId, message);
        // Generate AI response
        const aiResponse = await (0, ragService_1.generateResponse)(message, relevantChunks);
        // Add AI response to session
        (0, ragService_1.addMessageToSession)(sessionId, 'assistant', aiResponse);
        // Get updated session
        const updatedSession = (0, ragService_1.getChatSession)(sessionId);
        res.json({
            success: true,
            response: aiResponse,
            session: updatedSession,
            relevantChunks: relevantChunks.map(chunk => ({
                content: chunk.content.substring(0, 200) + '...',
                section: chunk.metadata.section,
                page: chunk.metadata.page
            }))
        });
    }
    catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({
            error: 'Failed to process message',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.sendMessage = sendMessage;
const getChatSessionData = async (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!sessionId) {
            return res.status(400).json({ error: 'Missing sessionId parameter' });
        }
        const session = (0, ragService_1.getChatSession)(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Chat session not found' });
        }
        res.json({
            success: true,
            session
        });
    }
    catch (error) {
        console.error('Error in getChatSessionData:', error);
        res.status(500).json({
            error: 'Failed to fetch chat session',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getChatSessionData = getChatSessionData;
const getAllSessions = async (req, res) => {
    try {
        const sessions = (0, ragService_1.getAllChatSessions)();
        res.json({
            success: true,
            sessions: sessions.map(session => ({
                id: session.id,
                documentId: session.documentId,
                messageCount: session.messages.length,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt
            }))
        });
    }
    catch (error) {
        console.error('Error in getAllSessions:', error);
        res.status(500).json({
            error: 'Failed to fetch chat sessions',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllSessions = getAllSessions;
