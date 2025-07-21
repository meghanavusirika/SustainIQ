"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables FIRST
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const esgReport_1 = __importDefault(require("./routes/esgReport"));
const riskRating_1 = __importDefault(require("./routes/riskRating"));
const prediction_1 = __importDefault(require("./routes/prediction"));
const map_1 = __importDefault(require("./routes/map"));
const chat_1 = __importDefault(require("./routes/chat"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Routes
app.use('/api/esg-report', esgReport_1.default);
app.use('/api/risk-rating', riskRating_1.default);
app.use('/api/prediction', prediction_1.default);
app.use('/api/map', map_1.default);
app.use('/api/chat', chat_1.default);
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
