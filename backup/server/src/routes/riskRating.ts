import { Router } from 'express';
import { getCompanyRiskRating } from '../controllers/riskRatingController';

const router = Router();

router.get('/company', getCompanyRiskRating);

export default router; 