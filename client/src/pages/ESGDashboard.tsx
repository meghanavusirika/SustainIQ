import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Radar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Minus, Download, Share2, ShieldAlert, AlertTriangle, ThumbsUp, ThumbsDown, Newspaper } from 'lucide-react';
import axios from 'axios';
import './ESGDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ESGData {
  companyId: number;
  environmental: {
    score: number;
    carbonEmissions: number;
    renewableEnergy: number;
    wasteManagement: number;
  };
  social: {
    score: number;
    laborRights: number;
    communityImpact: number;
    diversity: number;
  };
  governance: {
    score: number;
    boardDiversity: number;
    transparency: number;
    ethics: number;
  };
  overall: number;
  trend: Array<{
    year: number;
    score: number;
  }>;
  name: string;
  ticker: string;
  industry: string;
  headquarters: string;
}

const mockCompanies = [
  { id: 1, name: 'Apple Inc.', ticker: 'AAPL', industry: 'Technology', headquarters: 'Cupertino, California', esgScore: 85 },
  { id: 2, name: 'Microsoft Corporation', ticker: 'MSFT', industry: 'Technology', headquarters: 'Redmond, Washington', esgScore: 88 },
  { id: 3, name: 'Tesla Inc.', ticker: 'TSLA', industry: 'Automotive', headquarters: 'Palo Alto, California', esgScore: 72 },
  { id: 4, name: 'Johnson & Johnson', ticker: 'JNJ', industry: 'Healthcare', headquarters: 'New Brunswick, New Jersey', esgScore: 91 },
  { id: 5, name: 'Procter & Gamble', ticker: 'PG', industry: 'Consumer Goods', headquarters: 'Cincinnati, Ohio', esgScore: 87 },
  { id: 6, name: 'Nike Inc.', ticker: 'NKE', industry: 'Consumer Goods', headquarters: 'Beaverton, Oregon', esgScore: 79 },
  { id: 7, name: 'Coca-Cola Company', ticker: 'KO', industry: 'Beverages', headquarters: 'Atlanta, Georgia', esgScore: 83 },
  { id: 8, name: 'Walmart Inc.', ticker: 'WMT', industry: 'Retail', headquarters: 'Bentonville, Arkansas', esgScore: 76 },
  { id: 9, name: 'Amazon.com Inc.', ticker: 'AMZN', industry: 'Technology', headquarters: 'Seattle, Washington', esgScore: 68 },
  { id: 10, name: 'Google (Alphabet)', ticker: 'GOOGL', industry: 'Technology', headquarters: 'Mountain View, California', esgScore: 82 }
];

const ESGDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [esgData, setEsgData] = useState<ESGData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'environmental' | 'social' | 'governance'>('environmental');
  const [riskData, setRiskData] = useState<null | {
    riskScore: number;
    avgSentiment: number;
    controversyCount: number;
    newsSample: string[];
  }>(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskError, setRiskError] = useState<string | null>(null);
  const [predictionData, setPredictionData] = useState<null | {
    prediction: {
      historical: Array<{ year: number; score: number }>;
      predicted: Array<{ year: number; score: number }>;
      trend: 'increasing' | 'decreasing' | 'stable';
      confidence: number;
    };
    metadata: {
      model: string;
      lastUpdated: string;
      dataPoints: number;
      predictionHorizon: number;
    };
  }>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Current company ID:', id);
    const fetchESGData = async () => {
      setLoading(true);
      try {
        console.log('Fetching data for company ID:', id);
        const response = await axios.get(`http://localhost:5001/api/map/company/${id}`);
        const { company, esgDetails } = response.data;
        console.log('Received company data:', company);
        
        const mockTrend = [
          { year: 2020, score: company.esgScore - 5 },
          { year: 2021, score: company.esgScore - 3 },
          { year: 2022, score: company.esgScore - 1 },
          { year: 2023, score: company.esgScore },
        ];
        
        setEsgData({
          companyId: company.id,
          environmental: {
            score: esgDetails.environmental,
            carbonEmissions: Math.round(esgDetails.environmental * 0.9),
            renewableEnergy: Math.round(esgDetails.environmental * 1.1),
            wasteManagement: Math.round(esgDetails.environmental * 1.05),
          },
          social: {
            score: esgDetails.social,
            laborRights: Math.round(esgDetails.social * 1.05),
            communityImpact: Math.round(esgDetails.social * 0.95),
            diversity: Math.round(esgDetails.social * 1.1),
          },
          governance: {
            score: esgDetails.governance,
            boardDiversity: Math.round(esgDetails.governance * 1.1),
            transparency: Math.round(esgDetails.governance * 1.05),
            ethics: Math.round(esgDetails.governance * 0.95),
          },
          overall: company.esgScore,
          trend: mockTrend,
          name: company.name,
          ticker: company.ticker,
          industry: company.industry,
          headquarters: company.headquarters,
        });
      } catch (error) {
        console.error('Error fetching company data:', error);
        const fallbackCompany = mockCompanies.find(c => c.id === parseInt(id || '1')) || mockCompanies[0];
        console.log('Using fallback company:', fallbackCompany);
        
        const mockData: ESGData = {
          companyId: fallbackCompany.id,
          environmental: {
            score: fallbackCompany.esgScore,
            carbonEmissions: Math.round(fallbackCompany.esgScore * 0.9),
            renewableEnergy: Math.round(fallbackCompany.esgScore * 1.1),
            wasteManagement: Math.round(fallbackCompany.esgScore * 1.05)
          },
          social: {
            score: fallbackCompany.esgScore,
            laborRights: Math.round(fallbackCompany.esgScore * 1.05),
            communityImpact: Math.round(fallbackCompany.esgScore * 0.95),
            diversity: Math.round(fallbackCompany.esgScore * 1.1)
          },
          governance: {
            score: fallbackCompany.esgScore,
            boardDiversity: Math.round(fallbackCompany.esgScore * 1.1),
            transparency: Math.round(fallbackCompany.esgScore * 1.05),
            ethics: Math.round(fallbackCompany.esgScore * 0.95)
          },
          overall: fallbackCompany.esgScore,
          trend: [
            { year: 2020, score: fallbackCompany.esgScore - 5 },
            { year: 2021, score: fallbackCompany.esgScore - 3 },
            { year: 2022, score: fallbackCompany.esgScore - 1 },
            { year: 2023, score: fallbackCompany.esgScore }
          ],
          name: fallbackCompany.name,
          ticker: fallbackCompany.ticker,
          industry: fallbackCompany.industry,
          headquarters: fallbackCompany.headquarters,
        };
        setEsgData(mockData);
      } finally {
        setLoading(false);
      }
    };
    fetchESGData();
  }, [id]);

  useEffect(() => {
    if (!esgData) return;
    const fetchRisk = async () => {
      setRiskLoading(true);
      setRiskError(null);
      try {
        const response = await axios.get('http://localhost:5001/api/risk-rating/company', {
          params: {
            company: esgData.name,
            esgScore: esgData.overall,
          },
        });
        setRiskData(response.data);
      } catch (err: any) {
        setRiskError(err?.response?.data?.error || 'Failed to fetch risk score');
      } finally {
        setRiskLoading(false);
      }
    };
    fetchRisk();
  }, [esgData]);

  useEffect(() => {
    if (!esgData) return;
    const fetchPrediction = async () => {
      setPredictionLoading(true);
      setPredictionError(null);
      try {
        const response = await axios.get('http://localhost:5001/api/prediction/esg-prediction', {
          params: {
            companyId: esgData.companyId,
            yearsToPredict: 3,
          },
        });
        setPredictionData(response.data);
      } catch (err: any) {
        setPredictionError(err?.response?.data?.error || 'Failed to fetch prediction');
      } finally {
        setPredictionLoading(false);
      }
    };
    fetchPrediction();
  }, [esgData]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Poor';
  };

  const trendData = {
    labels: [
      ...(esgData?.trend.map(t => t.year.toString()) || []),
      ...(predictionData?.prediction.predicted.map(p => p.year.toString()) || [])
    ],
    datasets: [
      {
        label: 'Historical ESG Score',
        data: esgData?.trend.map(t => t.score) || [],
        borderColor: '#1a3a2b',
        backgroundColor: 'rgba(26, 58, 43, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Predicted ESG Score',
        data: [
          ...Array(esgData?.trend.length || 0).fill(null),
          ...(predictionData?.prediction.predicted.map(p => p.score) || [])
        ],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ['Environmental', 'Social', 'Governance'],
    datasets: [
      {
        data: [
          esgData?.environmental.score || 0,
          esgData?.social.score || 0,
          esgData?.governance.score || 0,
        ],
        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  };

  const radarData = {
    labels: ['Carbon Emissions', 'Renewable Energy', 'Waste Management', 'Labor Rights', 'Community Impact', 'Diversity', 'Board Diversity', 'Transparency', 'Ethics'],
    datasets: [
      {
        label: 'Current Scores',
        data: [
          esgData?.environmental.carbonEmissions || 0,
          esgData?.environmental.renewableEnergy || 0,
          esgData?.environmental.wasteManagement || 0,
          esgData?.social.laborRights || 0,
          esgData?.social.communityImpact || 0,
          esgData?.social.diversity || 0,
          esgData?.governance.boardDiversity || 0,
          esgData?.governance.transparency || 0,
          esgData?.governance.ethics || 0,
        ],
        backgroundColor: 'rgba(26, 58, 43, 0.2)',
        borderColor: '#1a3a2b',
        borderWidth: 2,
        pointBackgroundColor: '#1a3a2b',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#1a3a2b',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading ESG data...</p>
      </div>
    );
  }

  if (!esgData) {
    return (
      <div className="dashboard-error">
        <p>Error loading ESG data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="company-info">
          <h1>{esgData.name} ({esgData.ticker})</h1>
          <p>{esgData.industry} • {esgData.headquarters}</p>
        </div>
        <div className="header-actions">
          <button className="action-btn">
            <Download size={16} />
            Download Report
          </button>
          <button className="action-btn">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      <div className="overall-score-section">
        <div className="score-card main-score">
          <h2>Overall ESG Score</h2>
          <div className="score-display">
            <div 
              className="score-circle"
              style={{ 
                background: `conic-gradient(${getScoreColor(esgData.overall)} ${esgData.overall * 3.6}deg, #e5e7eb ${esgData.overall * 3.6}deg)`
              }}
            >
              <div className="score-inner">
                <span className="score-number">{esgData.overall}</span>
                <span className="score-label">{getScoreLabel(esgData.overall)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ESG Risk Score Section */}
        <div className="score-card risk-score-card">
          <h2>AI ESG Risk Score</h2>
          {riskLoading ? (
            <div className="risk-loading">Calculating risk...</div>
          ) : riskError ? (
            <div className="risk-error">{riskError}</div>
          ) : riskData ? (
            <>
              <div className="risk-score-display">
                <ShieldAlert size={32} color={riskData.riskScore > 70 ? '#ef4444' : riskData.riskScore > 40 ? '#f59e0b' : '#10b981'} />
                <span className="risk-score-number">{riskData.riskScore}</span>
                <span className="risk-score-label">{riskData.riskScore > 70 ? 'High Risk' : riskData.riskScore > 40 ? 'Moderate Risk' : 'Low Risk'}</span>
              </div>
              <div className="risk-details">
                <div className="risk-detail">
                  {riskData.avgSentiment >= 0 ? <ThumbsUp size={16} color="#10b981" /> : <ThumbsDown size={16} color="#ef4444" />}
                  <span>News Sentiment: <b>{riskData.avgSentiment >= 0 ? 'Positive' : 'Negative'}</b></span>
                </div>
                <div className="risk-detail">
                  <AlertTriangle size={16} color="#f59e0b" />
                  <span>Controversies: <b>{riskData.controversyCount}</b></span>
                </div>
                <div className="risk-detail">
                  <Newspaper size={16} color="#3b82f6" />
                  <span>Recent ESG News:</span>
                </div>
                <ul className="risk-news-list">
                  {riskData.newsSample.map((headline, idx) => (
                    <li key={idx}>{headline}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </div>

        <div className="score-breakdown">
          <div className="score-card">
            <h3>Environmental</h3>
            <div className="mini-score">
              <span className="score">{esgData.environmental.score}</span>
              <span className="label">Score</span>
            </div>
          </div>
          <div className="score-card">
            <h3>Social</h3>
            <div className="mini-score">
              <span className="score">{esgData.social.score}</span>
              <span className="label">Score</span>
            </div>
          </div>
          <div className="score-card">
            <h3>Governance</h3>
            <div className="mini-score">
              <span className="score">{esgData.governance.score}</span>
              <span className="label">Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>ESG Score Trend & Prediction (2020-2026)</h3>
          <Line data={trendData} options={chartOptions} />
          {predictionData && (
            <div className="prediction-info">
              <div className="prediction-metrics">
                <div className="prediction-metric">
                  <span className="metric-label">Trend:</span>
                  <span className={`metric-value trend-${predictionData.prediction.trend}`}>
                    {predictionData.prediction.trend.charAt(0).toUpperCase() + predictionData.prediction.trend.slice(1)}
                  </span>
                </div>
                <div className="prediction-metric">
                  <span className="metric-label">Confidence:</span>
                  <span className="metric-value">{predictionData.prediction.confidence}%</span>
                </div>
                <div className="prediction-metric">
                  <span className="metric-label">Model:</span>
                  <span className="metric-value">{predictionData.metadata.model}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3>ESG Score Distribution</h3>
          <Doughnut data={doughnutData} options={chartOptions} />
        </div>
      </div>

      <div className="detailed-metrics">
        <h3>Detailed Metrics</h3>
        <div className="metrics-tabs">
          <button 
            className={`tab ${selectedMetric === 'environmental' ? 'active' : ''}`}
            onClick={() => setSelectedMetric('environmental')}
          >
            Environmental
          </button>
          <button 
            className={`tab ${selectedMetric === 'social' ? 'active' : ''}`}
            onClick={() => setSelectedMetric('social')}
          >
            Social
          </button>
          <button 
            className={`tab ${selectedMetric === 'governance' ? 'active' : ''}`}
            onClick={() => setSelectedMetric('governance')}
          >
            Governance
          </button>
        </div>

        <div className="metrics-content">
          {selectedMetric === 'environmental' && (
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">Carbon Emissions</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${esgData.environmental.carbonEmissions}%` }}
                  ></div>
                </div>
                <span className="metric-value">{esgData.environmental.carbonEmissions}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Renewable Energy</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${esgData.environmental.renewableEnergy}%` }}
                  ></div>
                </div>
                <span className="metric-value">{esgData.environmental.renewableEnergy}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Waste Management</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${esgData.environmental.wasteManagement}%` }}
                  ></div>
                </div>
                <span className="metric-value">{esgData.environmental.wasteManagement}</span>
              </div>
            </div>
          )}

          {selectedMetric === 'social' && (
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">Labor Rights</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${esgData.social.laborRights}%` }}
                  ></div>
                </div>
                <span className="metric-value">{esgData.social.laborRights}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Community Impact</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${esgData.social.communityImpact}%` }}
                  ></div>
                </div>
                <span className="metric-value">{esgData.social.communityImpact}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Diversity</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${esgData.social.diversity}%` }}
                  ></div>
                </div>
                <span className="metric-value">{esgData.social.diversity}</span>
              </div>
            </div>
          )}

          {selectedMetric === 'governance' && (
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">Board Diversity</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${esgData.governance.boardDiversity}%` }}
                  ></div>
                </div>
                <span className="metric-value">{esgData.governance.boardDiversity}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Transparency</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${esgData.governance.transparency}%` }}
                  ></div>
                </div>
                <span className="metric-value">{esgData.governance.transparency}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Ethics</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${esgData.governance.ethics}%` }}
                  ></div>
                </div>
                <span className="metric-value">{esgData.governance.ethics}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="radar-chart-section">
        <h3>Comprehensive ESG Analysis</h3>
        <Radar data={radarData} options={radarOptions} />
      </div>
    </div>
  );
};

export default ESGDashboard;