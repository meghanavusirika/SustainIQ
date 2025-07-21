"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoricalData = exports.getESGPrediction = void 0;
const predictionService_1 = require("../services/predictionService");
const getESGPrediction = async (req, res) => {
    try {
        const { companyId, yearsToPredict = 3 } = req.query;
        if (!companyId) {
            return res.status(400).json({ error: 'Missing companyId parameter' });
        }
        const companyIdNum = Number(companyId);
        const yearsToPredictNum = Number(yearsToPredict);
        // For now, use mock data. In production, this would fetch from ESG Book API
        const historicalData = (0, predictionService_1.generateMockHistoricalData)(companyIdNum);
        // Generate prediction
        const prediction = (0, predictionService_1.predictESGTrend)(historicalData, yearsToPredictNum);
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
    }
    catch (error) {
        console.error('Error in getESGPrediction:', error);
        res.status(500).json({
            error: 'Failed to generate ESG prediction',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getESGPrediction = getESGPrediction;
const getHistoricalData = async (req, res) => {
    try {
        const { companyId } = req.params;
        if (!companyId) {
            return res.status(400).json({ error: 'Missing companyId parameter' });
        }
        const companyIdNum = Number(companyId);
        // For now, use mock data. In production, this would fetch from ESG Book API
        const historicalData = (0, predictionService_1.generateMockHistoricalData)(companyIdNum);
        res.json({
            companyId: companyIdNum,
            historicalData,
            metadata: {
                dataSource: 'Mock Data (ESG Book API in production)',
                lastUpdated: new Date().toISOString(),
                dataPoints: historicalData.length
            }
        });
    }
    catch (error) {
        console.error('Error in getHistoricalData:', error);
        res.status(500).json({
            error: 'Failed to fetch historical data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getHistoricalData = getHistoricalData;
