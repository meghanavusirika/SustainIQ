import { Router } from 'express';
import { uploadMiddleware, summarizeReport } from '../controllers/esgReportController';

const router = Router();

// Route for uploading and summarizing ESG reports
router.post('/summarize', uploadMiddleware, summarizeReport);

export default router; 