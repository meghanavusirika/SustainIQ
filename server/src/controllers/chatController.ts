import { Request, Response } from 'express';
import { extractTextFromBuffer } from '../services/pdfParser';
import { 
  processDocument, 
  findRelevantChunks, 
  generateResponse, 
  createChatSession, 
  addMessageToSession, 
  getChatSession, 
  getAllChatSessions 
} from '../services/ragService';

export const uploadDocumentForChat = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Extract text from PDF
    const pdfText = await extractTextFromBuffer(req.file.buffer);
    
    if (!pdfText || pdfText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    // Generate document ID
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Process document for RAG
    await processDocument(documentId, pdfText);
    
    // Create chat session
    const sessionId = createChatSession(documentId);
    
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

  } catch (error) {
    console.error('Error in uploadDocumentForChat:', error);
    
    // Clean up uploaded file on error
    if (req.file?.path && require('fs').existsSync(req.file.path)) {
      require('fs').unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Failed to process document for chat',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    const session = getChatSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Add user message to session
    addMessageToSession(sessionId, 'user', message);

    // Find relevant chunks from the document
    const relevantChunks = await findRelevantChunks(session.documentId, message);
    
    // Generate AI response
    const aiResponse = await generateResponse(message, relevantChunks);
    
    // Add AI response to session
    addMessageToSession(sessionId, 'assistant', aiResponse);

    // Get updated session
    const updatedSession = getChatSession(sessionId);

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

  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getChatSessionData = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId parameter' });
    }

    const session = getChatSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Error in getChatSessionData:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chat session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const sessions = getAllChatSessions();
    
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

  } catch (error) {
    console.error('Error in getAllSessions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chat sessions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 