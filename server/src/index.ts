import express fromexpress';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv fromdotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000
// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status:OK message:SustainIQ API is running });
});

// Mock ESG data endpoint
app.get('/api/companies/search', (req, res) =>[object Object]
  const { query } = req.query;
  const mockCompanies = [
    { id: 1, name: Apple Inc., ticker:AAPLector: 'Technology' },
    { id: 2, name: 'Microsoft Corporation, ticker:MSFTector: 'Technology' },
  [object Object] id: 3, name: Tesla Inc., ticker:TSLA', sector: 'Automotive' },
    { id:4, name: Johnson & Johnson', ticker: 'JNJ', sector: 'Healthcare' },
  [object Object] id:5, name:Procter & Gamble', ticker: 'PG', sector: 'Consumer Goods' }
  ];
  
  const filtered = mockCompanies.filter(company => 
    company.name.toLowerCase().includes((query as string).toLowerCase()) ||
    company.ticker.toLowerCase().includes((query as string).toLowerCase())
  );
  
  res.json(filtered);
});

// Mock ESG scores endpoint
app.get(/api/esg/:companyId', (req, res) => {
  const { companyId } = req.params;
  const mockESGData = {
    companyId: parseInt(companyId),
    environmental:[object Object]
      score: 85   carbonEmissions: 75   renewableEnergy: 90,
      wasteManagement: 88
    },
    social:[object Object]
      score: 78,
      laborRights: 82   communityImpact: 75,
      diversity: 80
    },
    governance:[object Object]
      score: 92,
      boardDiversity: 88,
      transparency: 95,
      ethics: 90
    },
    overall:85    trend: [
 [object Object] year: 220score: 78 },
 [object Object] year: 221score: 81 },
 [object Object] year: 222score: 83 },
 [object Object] year: 2023score: 85 }
    ]
  };
  
  res.json(mockESGData);
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) =>[object Object] console.error(err.stack);
  res.status(500 error: 'Something went wrong!' });
});

app.listen(PORT, () =>[object Object]
  console.log(`🚀 SustainIQ Server running on port ${PORT}`);
  console.log(`📊 ESG Tracker API ready at http://localhost:${PORT}/api`);
}); 