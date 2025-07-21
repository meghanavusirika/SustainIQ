import { Router } from 'express';
import { getCompanyMapData, getCompanyDetails } from '../controllers/mapController';

const router = Router();

// Get company map data with filters
router.get('/companies', getCompanyMapData);

// Get detailed company information
router.get('/company/:companyId', getCompanyDetails);

export default router; 