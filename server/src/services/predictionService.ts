// Simple prediction service using linear regression
// In production, this would use Prophet, XGBoost, or other ML models

interface HistoricalDataPoint {
  year: number;
  score: number;
}

interface PredictionResult {
  historical: HistoricalDataPoint[];
  predicted: HistoricalDataPoint[];
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
}

export function predictESGTrend(historicalData: HistoricalDataPoint[], yearsToPredict: number = 3): PredictionResult {
  if (historicalData.length < 2) {
    throw new Error('Need at least 2 data points for prediction');
  }

  // Simple linear regression
  const n = historicalData.length;
  const sumX = historicalData.reduce((sum, point) => sum + point.year, 0);
  const sumY = historicalData.reduce((sum, point) => sum + point.score, 0);
  const sumXY = historicalData.reduce((sum, point) => sum + point.year * point.score, 0);
  const sumXX = historicalData.reduce((sum, point) => sum + point.year * point.year, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Generate predictions
  const lastYear = Math.max(...historicalData.map(d => d.year));
  const predicted: HistoricalDataPoint[] = [];
  
  for (let i = 1; i <= yearsToPredict; i++) {
    const year = lastYear + i;
    const score = Math.max(0, Math.min(100, Math.round(slope * year + intercept)));
    predicted.push({ year, score });
  }

  // Determine trend
  let trend: 'increasing' | 'decreasing' | 'stable';
  if (Math.abs(slope) < 0.5) {
    trend = 'stable';
  } else if (slope > 0) {
    trend = 'increasing';
  } else {
    trend = 'decreasing';
  }

  // Calculate confidence based on R-squared
  const meanY = sumY / n;
  const ssRes = historicalData.reduce((sum, point) => {
    const predicted = slope * point.year + intercept;
    return sum + Math.pow(point.score - predicted, 2);
  }, 0);
  const ssTot = historicalData.reduce((sum, point) => {
    return sum + Math.pow(point.score - meanY, 2);
  }, 0);
  const rSquared = 1 - (ssRes / ssTot);
  const confidence = Math.max(0, Math.min(100, Math.round(rSquared * 100)));

  return {
    historical: historicalData,
    predicted,
    trend,
    confidence
  };
}

// Mock historical data generator for testing
export function generateMockHistoricalData(companyId: number, baseScore: number = 75): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const startYear = 2018;
  const currentYear = new Date().getFullYear();
  
  for (let year = startYear; year <= currentYear; year++) {
    // Add some realistic variation
    const variation = (Math.random() - 0.5) * 10;
    const score = Math.max(0, Math.min(100, Math.round(baseScore + variation)));
    data.push({ year, score });
  }
  
  return data;
} 