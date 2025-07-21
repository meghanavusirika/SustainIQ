"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const esgReportController_1 = require("../controllers/esgReportController");
const chatController_1 = require("../controllers/chatController");
const router = (0, express_1.Router)();
// Upload document for chat
router.post('/upload', esgReportController_1.uploadMiddleware, chatController_1.uploadDocumentForChat);
// Send message in chat session
router.post('/message', chatController_1.sendMessage);
// Get chat session data
router.get('/session/:sessionId', chatController_1.getChatSessionData);
// Get all chat sessions
router.get('/sessions', chatController_1.getAllSessions);
exports.default = router;
