import { Request, Response } from 'express';
import { predictESGTrend, generateMockHistoricalData } from '../services/predictionService';

export const getESGPrediction = async (req: Request, res: Response) => {
  try {
    const { companyId, yearsToPredict = 3 } = req.query;
    
    if (!companyId) {
      return res.status(400).json({ error: 'Missing companyId parameter' });
    }

    const companyIdNum = Number(companyId);
    const yearsToPredictNum = Number(yearsToPredict);

    // For now, use mock data. In production, this would fetch from ESG Book API
    const historicalData = generateMockHistoricalData(companyIdNum);
    
    // Generate prediction
    const prediction = predictESGTrend(historicalData, yearsToPredictNum);

    res.json({
      companyId: companyIdNum,
      prediction,
      metadata: {
        model: 'Linear Regression',
        lastUpdated: new Date().toISOString(),
        dataPoints: historicalData.length,
        predictionHorizon: yearsToPredictNum
      }
    });

  } catch (error) {
    console.error('Error in getESGPrediction:', error);
    res.status(500).json({ 
      error: 'Failed to generate ESG prediction',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getHistoricalData = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    
    if (!companyId) {
      return res.status(400).json({ error: 'Missing companyId parameter' });
    }

    const companyIdNum = Number(companyId);

    // For now, use mock data. In production, this would fetch from ESG Book API
    const historicalData = generateMockHistoricalData(companyIdNum);

    res.json({
      companyId: companyIdNum,
      historicalData,
      metadata: {
        dataSource: 'Mock Data (ESG Book API in production)',
        lastUpdated: new Date().toISOString(),
        dataPoints: historicalData.length
      }
    });

  } catch (error) {
    console.error('Error in getHistoricalData:', error);
    res.status(500).json({ 
      error: 'Failed to fetch historical data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 