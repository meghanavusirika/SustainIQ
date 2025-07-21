import dotenv from 'dotenv';
// Load environment variables FIRST
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import esgReportRoutes from './routes/esgReport';
import riskRatingRoutes from './routes/riskRating';
import predictionRoutes from './routes/prediction';
import mapRoutes from './routes/map';
import chatRoutes from './routes/chat';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/esg-report', esgReportRoutes);
app.use('/api/risk-rating', riskRatingRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/chat', chatRoutes);

// Mock ESG data endpoints (existing)
app.get('/api/companies', (req, res) => {
  const companies = [
    { id: 1, name: 'Apple Inc.', ticker: 'AAPL', industry: 'Technology', esgScore: 85 },
    { id: 2, name: 'Microsoft Corporation', ticker: 'MSFT', industry: 'Technology', esgScore: 88 },
    { id: 3, name: 'Tesla Inc.', ticker: 'TSLA', industry: 'Automotive', esgScore: 72 },
    { id: 4, name: 'Johnson & Johnson', ticker: 'JNJ', industry: 'Healthcare', esgScore: 91 },
    { id: 5, name: 'Procter & Gamble', ticker: 'PG', industry: 'Consumer Goods', esgScore: 87 },
    { id: 6, name: 'Nike Inc.', ticker: 'NKE', industry: 'Consumer Goods', esgScore: 79 },
    { id: 7, name: 'Coca-Cola Company', ticker: 'KO', industry: 'Beverages', esgScore: 83 },
    { id: 8, name: 'Walmart Inc.', ticker: 'WMT', industry: 'Retail', esgScore: 76 },
    { id: 9, name: 'Amazon.com Inc.', ticker: 'AMZN', industry: 'Technology', esgScore: 68 },
    { id: 10, name: 'Google (Alphabet)', ticker: 'GOOGL', industry: 'Technology', esgScore: 82 }
  ];
  res.json(companies);
});

app.get('/api/esg-data/:companyId', (req, res) => {
  const companyId = parseInt(req.params.companyId);
  const esgData = {
    companyId,
    overallScore: 85,
    environmental: {
      score: 88,
      carbonFootprint: 1200,
      renewableEnergy: 75,
      wasteManagement: 92
    },
    social: {
      score: 82,
      laborRights: 85,
      communityImpact: 78,
      diversity: 80
    },
    governance: {
      score: 85,
      boardDiversity: 88,
      transparency: 82,
      ethics: 85
    },
    historicalScores: [
      { year: 2020, score: 78 },
      { year: 2021, score: 81 },
      { year: 2022, score: 83 },
      { year: 2023, score: 85 }
    ]
  };
  res.json(esgData);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SustainIQ API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 SustainIQ Server running on port ${PORT}`);
  console.log(`📊 ESG Report Summarizer: POST /api/esg-report/summarize`);
  console.log(`🔍 Company Search: GET /api/companies`);
  console.log(`📈 ESG Data: GET /api/esg-data/:companyId`);
}); 