"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeReport = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pdfParser_1 = require("../services/pdfParser");
const huggingface_1 = require("../services/huggingface");
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
exports.uploadMiddleware = upload.single('pdf');
const summarizeReport = async (req, res) => {
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
        // Truncate text if too long (HuggingFace has limits)
        const maxLength = 4000; // Adjust based on model limits
        const truncatedText = pdfText.length > maxLength
            ? pdfText.substring(0, maxLength) + '...'
            : pdfText;
        // Summarize using HuggingFace
        const summary = await (0, huggingface_1.summarizeText)(truncatedText);
        // Clean up uploaded file
        if (req.file.path && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
        res.json({
            success: true,
            summary: summary,
            originalLength: pdfText.length,
            truncatedLength: truncatedText.length
        });
    }
    catch (error) {
        console.error('Error in summarizeReport:', error);
        // Clean up uploaded file on error
        if (((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
        res.status(500).json({
            error: 'Failed to process PDF report',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.summarizeReport = summarizeReport;
