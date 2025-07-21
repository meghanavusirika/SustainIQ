import { Request, Response } from 'express';
import { 
  getCompanyLocations, 
  filterCompaniesByIndustry, 
  filterCompaniesByScore, 
  filterCompaniesByRegion 
} from '../services/mapService';

export const getCompanyMapData = async (req: Request, res: Response) => {
  try {
    const { industry, minScore, maxScore, region } = req.query;
    
    let companies = getCompanyLocations();
    
    // Apply filters
    if (industry) {
      companies = filterCompaniesByIndustry(companies, String(industry));
    }
    
    if (minScore && maxScore) {
      companies = filterCompaniesByScore(companies, Number(minScore), Number(maxScore));
    }
    
    if (region) {
      companies = filterCompaniesByRegion(companies, String(region));
    }
    
    // Get unique industries and regions for filter options
    const allCompanies = getCompanyLocations();
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
    
  } catch (error) {
    console.error('Error in getCompanyMapData:', error);
    res.status(500).json({ 
      error: 'Failed to fetch company map data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCompanyDetails = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    
    if (!companyId) {
      return res.status(400).json({ error: 'Missing companyId parameter' });
    }
    
    const companies = getCompanyLocations();
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
    
  } catch (error) {
    console.error('Error in getCompanyDetails:', error);
    res.status(500).json({ 
      error: 'Failed to fetch company details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 