import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { Search, Plus, X, TrendingUp, Building2 } from 'lucide-react';
import './CompanyComparison.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Company {
  id: number;
  name: string;
  ticker: string;
  sector: string;
  esgData: {
    environmental: number;
    social: number;
    governance: number;
    overall: number;
  };
}

const CompanyComparison: React.FC = () => {
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);

  // Mock data
  const mockCompanies: Company[] = [
    {
      id: 1,
      name: 'Apple Inc.',
      ticker: 'AAPL',
      sector: 'Technology',
      esgData: { environmental: 85, social: 78, governance: 92, overall: 85 }
    },
    {
      id: 2,
      name: 'Microsoft Corporation',
      ticker: 'MSFT',
      sector: 'Technology',
      esgData: { environmental: 88, social: 82, governance: 90, overall: 87 }
    },
    {
      id: 3,
      name: 'Tesla Inc.',
      ticker: 'TSLA',
      sector: 'Automotive',
      esgData: { environmental: 92, social: 75, governance: 78, overall: 82 }
    },
    {
      id: 4,
      name: 'Johnson & Johnson',
      ticker: 'JNJ',
      sector: 'Healthcare',
      esgData: { environmental: 80, social: 85, governance: 88, overall: 84 }
    },
    {
      id: 5,
      name: 'Procter & Gamble',
      ticker: 'PG',
      sector: 'Consumer Goods',
      esgData: { environmental: 82, social: 80, governance: 85, overall: 82 }
    }
  ];

  useEffect(() => {
    setAvailableCompanies(mockCompanies);
  }, []);

  const addCompany = (company: Company) => {
    if (selectedCompanies.length < 5 && !selectedCompanies.find(c => c.id === company.id)) {
      setSelectedCompanies([...selectedCompanies, company]);
    }
    setShowSearch(false);
    setSearchQuery('');
  };

  const removeCompany = (companyId: number) => {
    setSelectedCompanies(selectedCompanies.filter(c => c.id !== companyId));
  };

  const filteredCompanies = availableCompanies.filter(company =>
    !selectedCompanies.find(c => c.id === company.id) &&
    (company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     company.ticker.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const barData = {
    labels: selectedCompanies.map(c => c.ticker),
    datasets: [
      {
        label: 'Environmental',
        data: selectedCompanies.map(c => c.esgData.environmental),
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1,
      },
      {
        label: 'Social',
        data: selectedCompanies.map(c => c.esgData.social),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
      },
      {
        label: 'Governance',
        data: selectedCompanies.map(c => c.esgData.governance),
        backgroundColor: '#8b5cf6',
        borderColor: '#7c3aed',
        borderWidth: 1,
      },
    ],
  };

  const overallData = {
    labels: selectedCompanies.map(c => c.ticker),
    datasets: [
      {
        label: 'Overall ESG Score',
        data: selectedCompanies.map(c => c.esgData.overall),
        backgroundColor: selectedCompanies.map(c => {
          const score = c.esgData.overall;
          if (score >= 80) return '#10b981';
          if (score >= 60) return '#f59e0b';
          return '#ef4444';
        }),
        borderColor: '#1a3a2b',
        borderWidth: 2,
      },
    ],
  };

  const radarData = {
    labels: ['Environmental', 'Social', 'Governance'],
    datasets: selectedCompanies.map((company, index) => ({
      label: company.ticker,
      data: [company.esgData.environmental, company.esgData.social, company.esgData.governance],
      backgroundColor: `rgba(${26 + index * 50}, ${58 + index * 30}, ${43 + index * 20}, 0.2)`,
      borderColor: `rgb(${26 + index * 50}, ${58 + index * 30}, ${43 + index * 20})`,
      borderWidth: 2,
      pointBackgroundColor: `rgb(${26 + index * 50}, ${58 + index * 30}, ${43 + index * 20})`,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: `rgb(${26 + index * 50}, ${58 + index * 30}, ${43 + index * 20})`,
    })),
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

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h1>🆚 Company Comparison</h1>
        <p>Compare ESG scores and sustainability metrics across multiple companies</p>
      </div>

      <div className="company-selector">
        <div className="selected-companies">
          {selectedCompanies.map(company => (
            <div key={company.id} className="selected-company-tag">
              <Building2 size={16} />
              <span>{company.ticker}</span>
              <button 
                onClick={() => removeCompany(company.id)}
                className="remove-btn"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {selectedCompanies.length < 5 && (
            <button 
              onClick={() => setShowSearch(true)}
              className="add-company-btn"
            >
              <Plus size={16} />
              Add Company
            </button>
          )}
        </div>

        {showSearch && (
          <div className="search-overlay">
            <div className="search-modal">
              <div className="search-header">
                <h3>Add Company to Comparison</h3>
                <button 
                  onClick={() => setShowSearch(false)}
                  className="close-btn"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="search-input-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="search-results">
                {filteredCompanies.map(company => (
                  <div
                    key={company.id}
                    className="search-result-item"
                    onClick={() => addCompany(company)}
                  >
                    <div className="company-info">
                      <div className="company-name">{company.name}</div>
                      <div className="company-ticker">{company.ticker}</div>
                    </div>
                    <div className="company-sector">{company.sector}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedCompanies.length === 0 ? (
        <div className="empty-state">
          <TrendingUp size={48} />
          <h2>No Companies Selected</h2>
          <p>Add companies to start comparing their ESG scores</p>
          <button 
            onClick={() => setShowSearch(true)}
            className="primary-btn"
          >
            <Plus size={16} />
            Add First Company
          </button>
        </div>
      ) : (
        <div className="comparison-content">
          <div className="overall-scores">
            <h2>Overall ESG Scores</h2>
            <div className="scores-grid">
              {selectedCompanies.map(company => (
                <div key={company.id} className="score-card">
                  <div className="score-header">
                    <h3>{company.ticker}</h3>
                    <span className="company-name">{company.name}</span>
                  </div>
                  <div className="score-display">
                    <div 
                      className="score-circle"
                      style={{ 
                        background: `conic-gradient(${company.esgData.overall >= 80 ? '#10b981' : company.esgData.overall >= 60 ? '#f59e0b' : '#ef4444'} ${company.esgData.overall * 3.6}deg, #e5e7eb ${company.esgData.overall * 3.6}deg)`
                      }}
                    >
                      <div className="score-inner">
                        <span className="score-number">{company.esgData.overall}</span>
                      </div>
                    </div>
                  </div>
                  <div className="score-breakdown">
                    <div className="breakdown-item">
                      <span className="label">E:</span>
                      <span className="value">{company.esgData.environmental}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="label">S:</span>
                      <span className="value">{company.esgData.social}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="label">G:</span>
                      <span className="value">{company.esgData.governance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-container">
              <h3>ESG Score Breakdown</h3>
              <Bar data={barData} options={chartOptions} />
            </div>

            <div className="chart-container">
              <h3>Overall Score Comparison</h3>
              <Bar data={overallData} options={chartOptions} />
            </div>
          </div>

          <div className="radar-chart-section">
            <h3>ESG Radar Comparison</h3>
            <Radar data={radarData} options={radarOptions} />
          </div>

          <div className="comparison-table">
            <h3>Detailed Comparison</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Environmental</th>
                    <th>Social</th>
                    <th>Governance</th>
                    <th>Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCompanies.map(company => (
                    <tr key={company.id}>
                      <td>
                        <div className="company-cell">
                          <strong>{company.ticker}</strong>
                          <span>{company.name}</span>
                        </div>
                      </td>
                      <td className="score-cell">{company.esgData.environmental}</td>
                      <td className="score-cell">{company.esgData.social}</td>
                      <td className="score-cell">{company.esgData.governance}</td>
                      <td className="overall-cell">{company.esgData.overall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyComparison; 