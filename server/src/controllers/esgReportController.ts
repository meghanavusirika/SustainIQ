import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractTextFromBuffer } from '../services/pdfParser';
import { summarizeText } from '../services/huggingface';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export const uploadMiddleware = upload.single('pdf');

export const summarizeReport = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Extract text from PDF
    const pdfText = await extractTextFromBuffer(req.file.buffer);
    
    if (!pdfText || pdfText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    // Truncate text if too long (HuggingFace has limits)
    const maxLength = 4000; // Adjust based on model limits
    const truncatedText = pdfText.length > maxLength 
      ? pdfText.substring(0, maxLength) + '...'
      : pdfText;

    // Summarize using HuggingFace
    const summary = await summarizeText(truncatedText);

    // Clean up uploaded file
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      summary: summary,
      originalLength: pdfText.length,
      truncatedLength: truncatedText.length
    });

  } catch (error) {
    console.error('Error in summarizeReport:', error);
    
    // Clean up uploaded file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Failed to process PDF report',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 