"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const riskRatingController_1 = require("../controllers/riskRatingController");
const router = (0, express_1.Router)();
router.get('/company', riskRatingController_1.getCompanyRiskRating);
exports.default = router;
