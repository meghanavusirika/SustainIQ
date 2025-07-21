"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyDetails = exports.getCompanyMapData = void 0;
const mapService_1 = require("../services/mapService");
const getCompanyMapData = async (req, res) => {
    try {
        const { industry, minScore, maxScore, region } = req.query;
        let companies = (0, mapService_1.getCompanyLocations)();
        // Apply filters
        if (industry) {
            companies = (0, mapService_1.filterCompaniesByIndustry)(companies, String(industry));
        }
        if (minScore && maxScore) {
            companies = (0, mapService_1.filterCompaniesByScore)(companies, Number(minScore), Number(maxScore));
        }
        if (region) {
            companies = (0, mapService_1.filterCompaniesByRegion)(companies, String(region));
        }
        // Get unique industries and regions for filter options
        const allCompanies = (0, mapService_1.getCompanyLocations)();
        const industries = ['All', ...Array.from(new Set(allCompanies.map(c => c.industry)))];
        const regions = ['All', 'North America', 'Europe', 'Asia', 'Other'];
        res.json({
            companies,
            filters: {
                industries,
                regions,
                scoreRange: { min: 0, max: 100 }
            },
            metadata: {
                totalCompanies: companies.length,
                appliedFilters: {
                    industry: industry || 'All',
                    scoreRange: minScore && maxScore ? `${minScore}-${maxScore}` : 'All',
                    region: region || 'All'
                }
            }
        });
    }
    catch (error) {
        console.error('Error in getCompanyMapData:', error);
        res.status(500).json({
            error: 'Failed to fetch company map data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getCompanyMapData = getCompanyMapData;
const getCompanyDetails = async (req, res) => {
    try {
        const { companyId } = req.params;
        if (!companyId) {
            return res.status(400).json({ error: 'Missing companyId parameter' });
        }
        const companies = (0, mapService_1.getCompanyLocations)();
        const company = companies.find(c => c.id === Number(companyId));
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json({
            company,
            // Add additional ESG data here when available
            esgDetails: {
                environmental: Math.round(company.esgScore * 0.35),
                social: Math.round(company.esgScore * 0.35),
                governance: Math.round(company.esgScore * 0.30)
            }
        });
    }
    catch (error) {
        console.error('Error in getCompanyDetails:', error);
        res.status(500).json({
            error: 'Failed to fetch company details',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getCompanyDetails = getCompanyDetails;
