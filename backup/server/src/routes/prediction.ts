import { Router } from 'express';
import { getESGPrediction, getHistoricalData } from '../controllers/predictionController';

const router = Router();

// Get ESG prediction for a company
router.get('/esg-prediction', getESGPrediction);

// Get historical ESG data for a company
router.get('/historical/:companyId', getHistoricalData);

export default router; 