import React, { useState, useEffect } from 'react';
import { Search, Building2, TrendingUp, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CompanySearch.css';

interface Company {
  id: number;
  name: string;
  ticker: string;
  sector: string;
  location?: string;
}

const ESGDashboardUnified: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false); // New state for suggestions visibility

  // Mock data for demonstration
  const mockCompanies: Company[] = [
    { id: 1, name: 'Apple Inc.', ticker: 'AAPL', sector: 'Technology', location: 'Cupertino, CA' },
    { id: 2, name: 'Microsoft Corporation', ticker: 'MSFT', sector: 'Technology', location: 'Redmond, WA' },
    { id: 3, name: 'Tesla Inc.', ticker: 'TSLA', sector: 'Automotive', location: 'Austin, TX' },
    { id: 4, name: 'Johnson & Johnson', ticker: 'JNJ', sector: 'Healthcare', location: 'New Brunswick, NJ' },
    { id: 5, name: 'Procter & Gamble', ticker: 'PG', sector: 'Consumer Goods', location: 'Cincinnati, OH' },
    { id: 6, name: 'Amazon.com Inc.', ticker: 'AMZN', sector: 'E-commerce', location: 'Seattle, WA' },
    { id: 7, name: 'Alphabet Inc.', ticker: 'GOOGL', sector: 'Technology', location: 'Mountain View, CA' },
    { id: 8, name: 'Nike Inc.', ticker: 'NKE', sector: 'Consumer Goods', location: 'Beaverton, OR' },
    { id: 9, name: 'Coca-Cola Company', ticker: 'KO', sector: 'Beverages', location: 'Atlanta, GA' },
    { id: 10, name: 'Walmart Inc.', ticker: 'WMT', sector: 'Retail', location: 'Bentonville, AR' }
  ];

  // Add Netflix and Google to mockCompanies if not present
  const extendedCompanies = [
    ...mockCompanies,
    { id: 11, name: 'Netflix, Inc.', ticker: 'NFLX', sector: 'Technology', location: 'Los Gatos, CA' },
    { id: 12, name: 'Google (Alphabet)', ticker: 'GOOGL', sector: 'Technology', location: 'Mountain View, CA' },
  ];

  useEffect(() => {
    setCompanies(mockCompanies);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCompanies([]);
      return;
    }
    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchQuery, companies]);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setSearchQuery(''); // Clear the search box
    setShowSuggestions(false); // Hide suggestions
    // Blur the input if possible
    const input = document.querySelector<HTMLInputElement>('.search-bar');
    if (input) input.blur();
  };

  const handleViewESG = () => {
    if (selectedCompany) {
      navigate(`/dashboard/${selectedCompany.id}`);
      setSelectedCompany(null); // Hide the card immediately
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 ESG Dashboard</h1>
        <p>Search for public companies and view their ESG scores, trends, and detailed metrics</p>
      </div>
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div className="search-bar-container" style={{ width: '100%', maxWidth: 480 }}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search by company name or ticker symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery.trim() && filteredCompanies.length > 0 && (
          <div className="suggestions-container">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="suggestion-item"
                onClick={() => handleCompanySelect(company)}
              >
                <div className="company-info">
                  <div className="company-name">{company.name}</div>
                  <div className="company-ticker">{company.ticker}</div>
                </div>
                <div className="company-details">
                  <span className="sector">{company.sector}</span>
                  {company.location && (
                    <span className="location">
                      <MapPin size={12} />
                      {company.location}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCompany && (
        <div className="selected-company">
          <div className="company-card">
            <div className="company-header">
              <Building2 className="company-icon" />
              <div>
                <h2>{selectedCompany.name}</h2>
                <p className="ticker">{selectedCompany.ticker}</p>
              </div>
            </div>
            <div className="company-stats">
              <div className="stat">
                <span className="label">Sector:</span>
                <span className="value">{selectedCompany.sector}</span>
              </div>
              {selectedCompany.location && (
                <div className="stat">
                  <span className="label">Location:</span>
                  <span className="value">{selectedCompany.location}</span>
                </div>
              )}
            </div>
            <button onClick={handleViewESG} className="view-esg-btn">
              <TrendingUp size={16} />
              View ESG Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="search-tips" style={{ display: filteredCompanies.length === 0 && !selectedCompany ? 'block' : 'none' }}>
        <span className="tips-title">💡 Search Tips</span>
        <ul>
          <li>Search by company name (e.g., "Apple", "Microsoft")</li>
          <li>Search by ticker symbol (e.g., "AAPL", "MSFT")</li>
          <li>Browse popular companies below</li>
        </ul>
      </div>

      <div className="popular-companies-header">
        <span>📈 Popular Companies</span>
      </div>
      <div className="company-grid">
        {extendedCompanies.slice(0, 8).map((company) => (
          <div
            key={company.id}
            className="company-card"
            onClick={() => handleCompanySelect(company)}
          >
            <div className="company-name">{company.name}</div>
            <div className="company-ticker">{company.ticker}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ESGDashboardUnified; 