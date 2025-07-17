import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Award, Building2 } from 'lucide-react';
import './IndustryBenchmarking.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface IndustryData {
  sector: string;
  averageESG: number;
  environmental: number;
  social: number;
  governance: number;
  companyCount: number;
  topCompanies: Array<{ name: string; ticker: string; score: number }>;
}

const IndustryBenchmarking: React.FC = () => {
  const [industryData, setIndustryData] = useState<IndustryData[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'companies'>('score');
  const [loading, setLoading] = useState(true);

  // Mock industry data
  const mockIndustryData: IndustryData[] = [
    {
      sector: 'Technology',
      averageESG: 82,
      environmental: 85,
      social: 78,
      governance: 83,
      companyCount: 45,
      topCompanies: [
        { name: 'Apple Inc.', ticker: 'AAPL', score: 85 },
        { name: 'Microsoft Corp.', ticker: 'MSFT', score: 87 },
        { name: 'Alphabet Inc.', ticker: 'GOOGL', score: 83 },
      ],
    },
    {
      sector: 'Healthcare',
      averageESG: 79,
      environmental: 76,
      social: 82,
      governance: 79,
      companyCount: 38,
      topCompanies: [
        { name: 'Johnson & Johnson', ticker: 'JNJ', score: 84 },
        { name: 'UnitedHealth Group', ticker: 'UNH', score: 81 },
        { name: 'Pfizer Inc.', ticker: 'PFE', score: 78 },
      ],
    },
    {
      sector: 'Financial Services',
      averageESG: 75,
      environmental: 72,
      social: 76,
      governance: 77,
      companyCount: 52,
      topCompanies: [
        { name: 'JPMorgan Chase', ticker: 'JPM', score: 78 },
        { name: 'Bank of America', ticker: 'BAC', score: 76 },
        { name: 'Wells Fargo', ticker: 'WFC', score: 74 },
      ],
    },
    {
      sector: 'Consumer Goods',
      averageESG: 77,
      environmental: 79,
      social: 75,
      governance: 77,
      companyCount: 41,
      topCompanies: [
        { name: 'Procter & Gamble', ticker: 'PG', score: 82 },
        { name: 'Nike Inc.', ticker: 'NKE', score: 80 },
        { name: 'Coca-Cola Co.', ticker: 'KO', score: 78 },
      ],
    },
    {
      sector: 'Energy',
      averageESG: 68,
      environmental: 65,
      social: 70,
      governance: 69,
      companyCount: 28,
      topCompanies: [
        { name: 'NextEra Energy', ticker: 'NEE', score: 75 },
        { name: 'Exxon Mobil', ticker: 'XOM', score: 72 },
        { name: 'Chevron Corp.', ticker: 'CVX', score: 70 },
      ],
    },
    {
      sector: 'Automotive',
      averageESG: 71,
      environmental: 74,
      social: 68,
      governance: 71,
      companyCount: 22,
      topCompanies: [
        { name: 'Tesla Inc.', ticker: 'TSLA', score: 82 },
        { name: 'Toyota Motor', ticker: 'TM', score: 76 },
        { name: 'General Motors', ticker: 'GM', score: 73 },
      ],
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIndustryData(mockIndustryData);
      setLoading(false);
    }, 800);
  }, []);

  const filteredData = selectedSector === 'all'
    ? industryData
    : industryData.filter(industry => industry.sector === selectedSector);

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'score') return b.averageESG - a.averageESG;
    return b.companyCount - a.companyCount;
  });

  const barData = {
    labels: sortedData.map(industry => industry.sector),
    datasets: [
      {
        label: 'Environmental',
        data: sortedData.map(industry => industry.environmental),
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1,
      },
      {
        label: 'Social',
        data: sortedData.map(industry => industry.social),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
      },
      {
        label: 'Governance',
        data: sortedData.map(industry => industry.governance),
        backgroundColor: '#8b5cf6',
        borderColor: '#7c3aed',
        borderWidth: 1,
      },
    ],
  };

  const overallData = {
    labels: sortedData.map(industry => industry.sector),
    datasets: [
      {
        label: 'Average ESG Score',
        data: sortedData.map(industry => industry.averageESG),
        backgroundColor: sortedData.map(industry => {
          if (industry.averageESG >= 80) return '#10b981';
          if (industry.averageESG >= 70) return '#f59e0b';
          return '#ef4444';
        }),
        borderColor: '#1a3a2b',
        borderWidth: 2,
      },
    ],
  };

  const distributionData = {
    labels: ['Excellent (80-100)', 'Good (70-79)', 'Fair (60-69)', 'Poor (<60)'],
    datasets: [
      {
        data: [
          industryData.filter(i => i.averageESG >= 80).length,
          industryData.filter(i => i.averageESG >= 70 && i.averageESG < 80).length,
          industryData.filter(i => i.averageESG >= 60 && i.averageESG < 70).length,
          industryData.filter(i => i.averageESG < 60).length,
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
        borderWidth: 0,
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

  if (loading) {
    return (
      <div className="benchmarking-loading">
        <div className="loading-spinner"></div>
        <p>Loading industry benchmarking data...</p>
      </div>
    );
  }

  return (
    <div className="benchmarking-container">
      <div className="benchmarking-header">
        <h1>🌱 Industry Benchmarking</h1>
        <p>Compare ESG performance across different industry sectors and identify sustainability leaders</p>
      </div>

      <div className="controls-section">
        <div className="filters">
          <div className="filter-group">
            <label>Industry Sector:</label>
            <select 
              value={selectedSector} 
              onChange={(e) => setSelectedSector(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Sectors</option>
              {industryData.map(industry => (
                <option key={industry.sector} value={industry.sector}>
                  {industry.sector}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Sort By:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'score' | 'companies')}
              className="filter-select"
            >
              <option value="score">ESG Score</option>
              <option value="companies">Company Count</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overview-cards">
        <div className="overview-card">
          <div className="card-icon">
            <TrendingUp />
          </div>
          <div className="card-content">
            <h3>Average ESG Score</h3>
            <div className="card-value">78.5</div>
            <div className="card-change positive">+2.3 vs last year</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="card-icon">
            <Building2 />
          </div>
          <div className="card-content">
            <h3>Industries Analyzed</h3>
            <div className="card-value">{industryData.length}</div>
            <div className="card-change">Active sectors</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="card-icon">
            <Award />
          </div>
          <div className="card-content">
            <h3>Top Performing Sector</h3>
            <div className="card-value">Technology</div>
            <div className="card-change">82.0 score</div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>ESG Score Breakdown by Industry</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h3>Overall ESG Score Ranking</h3>
          <Bar data={overallData} options={chartOptions} />
        </div>
      </div>

      <div className="distribution-section">
        <div className="chart-container">
          <h3>Score Distribution</h3>
          <Doughnut data={distributionData} options={chartOptions} />
        </div>
      </div>

      <div className="industry-rankings">
        <h2>Industry Rankings</h2>
        <div className="rankings-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Industry</th>
                <th>Avg ESG Score</th>
                <th>Environmental</th>
                <th>Social</th>
                <th>Governance</th>
                <th>Companies</th>
                <th>Top Performer</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((industry, index) => (
                <tr key={industry.sector}>
                  <td className="rank-cell">
                    <div className={`rank-badge ${index < 3 ? 'top-rank' : ''}`}>{index + 1}</div>
                  </td>
                  <td><strong>{industry.sector}</strong></td>
                  <td>{industry.averageESG}</td>
                  <td>{industry.environmental}</td>
                  <td>{industry.social}</td>
                  <td>{industry.governance}</td>
                  <td>{industry.companyCount}</td>
                  <td>{industry.topCompanies[0].name} ({industry.topCompanies[0].score})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IndustryBenchmarking; 