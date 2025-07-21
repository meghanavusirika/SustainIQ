import { Router } from 'express';
import { uploadMiddleware } from '../controllers/esgReportController';
import { 
  uploadDocumentForChat, 
  sendMessage, 
  getChatSessionData, 
  getAllSessions 
} from '../controllers/chatController';

const router = Router();

// Upload document for chat
router.post('/upload', uploadMiddleware, uploadDocumentForChat);

// Send message in chat session
router.post('/message', sendMessage);

// Get chat session data
router.get('/session/:sessionId', getChatSessionData);

// Get all chat sessions
router.get('/sessions', getAllSessions);

export default router; 