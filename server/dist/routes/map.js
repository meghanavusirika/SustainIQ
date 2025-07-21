"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mapController_1 = require("../controllers/mapController");
const router = (0, express_1.Router)();
// Get company map data with filters
router.get('/companies', mapController_1.getCompanyMapData);
// Get detailed company information
router.get('/company/:companyId', mapController_1.getCompanyDetails);
exports.default = router;
