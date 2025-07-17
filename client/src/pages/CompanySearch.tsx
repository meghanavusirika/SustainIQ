import React, { useState, useEffect, useCallback } from 'react';
import { Search, Building2, TrendingUp, MapPin } from 'lucide-react';
import axios from 'axios';
import './CompanySearch.css';

interface Company {
  id: number;
  name: string;
  ticker: string;
  sector: string;
  location?: string;
}

const CompanySearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  useEffect(() => {
    setCompanies(mockCompanies);
  }, []);

  const searchCompanies = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredCompanies([]);
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`/api/companies/search?query=${query}`);
      // setFilteredCompanies(response.data);
      
      // Mock API response
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.ticker.toLowerCase().includes(query.toLowerCase())
      );
      
      setTimeout(() => {
        setFilteredCompanies(filtered);
        setLoading(false);
      }, 300); // Simulate API delay
    } catch (error) {
      console.error('Error searching companies:', error);
      setLoading(false);
    }
  }, [companies]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchCompanies(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchCompanies]);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setSearchQuery(company.name);
    setShowSuggestions(false);
  };

  const handleViewESG = () => {
    if (selectedCompany) {
      window.location.href = `/dashboard/${selectedCompany.id}`;
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>🔍 Company Search</h1>
        <p>Search for public companies to view their ESG scores and sustainability metrics</p>
      </div>

      <div className="search-section">
        <div className="search-input-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by company name or ticker symbol..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="search-input"
          />
          {loading && <div className="loading-spinner"></div>}
        </div>

        {showSuggestions && filteredCompanies.length > 0 && (
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

      <div className="search-tips">
        <h3>💡 Search Tips</h3>
        <ul>
          <li>Search by company name (e.g., "Apple", "Microsoft")</li>
          <li>Search by ticker symbol (e.g., "AAPL", "MSFT")</li>
          <li>Browse popular companies below</li>
        </ul>
      </div>

      <div className="popular-companies">
        <h3>📈 Popular Companies</h3>
        <div className="companies-grid">
          {companies.slice(0, 6).map((company) => (
            <div
              key={company.id}
              className="company-card-small"
              onClick={() => handleCompanySelect(company)}
            >
              <div className="company-name-small">{company.name}</div>
              <div className="company-ticker-small">{company.ticker}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanySearch; 