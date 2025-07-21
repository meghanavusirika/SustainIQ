"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const predictionController_1 = require("../controllers/predictionController");
const router = (0, express_1.Router)();
// Get ESG prediction for a company
router.get('/esg-prediction', predictionController_1.getESGPrediction);
// Get historical ESG data for a company
router.get('/historical/:companyId', predictionController_1.getHistoricalData);
exports.default = router;
