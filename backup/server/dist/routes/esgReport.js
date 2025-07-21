"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const esgReportController_1 = require("../controllers/esgReportController");
const router = (0, express_1.Router)();
// Route for uploading and summarizing ESG reports
router.post('/summarize', esgReportController_1.uploadMiddleware, esgReportController_1.summarizeReport);
exports.default = router;
