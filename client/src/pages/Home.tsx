import React from 'react';
import { Link } from 'react-router-dom';
import { Search, BarChart3, TrendingUp, Globe, FileText, Newspaper, FileDown, Brain, MessageCircle } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>SustainIQ</h1>
        <p>Advanced ESG Analytics & AI-Powered Insights</p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Companies</span>
          </div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Industries</span>
          </div>
          <div className="stat">
            <span className="stat-number">AI</span>
            <span className="stat-label">Powered</span>
          </div>
        </div>
      </div>

      <div className="features-grid">
        <Link to="/dashboard" className="feature-card">
          <BarChart3 className="feature-icon" />
          <h3>ESG Dashboard</h3>
          <p>Visualize ESG trends and detailed metrics</p>
        </Link>

        <Link to="/compare" className="feature-card">
          <TrendingUp className="feature-icon" />
          <h3>Company Comparison</h3>
          <p>Compare ESG performance across companies</p>
        </Link>

        <Link to="/benchmark" className="feature-card">
          <Globe className="feature-icon" />
          <h3>Industry Benchmarking</h3>
          <p>Benchmark companies against industry standards</p>
        </Link>

        <Link to="/chat" className="feature-card">
          <MessageCircle className="feature-icon" />
          <h3>Chat with ESG Reports</h3>
          <p>Ask questions about uploaded ESG reports using AI</p>
        </Link>

        <Link to="/map" className="feature-card">
          <Globe className="feature-icon" />
          <h3>Interactive ESG Map</h3>
          <p>Explore ESG scores on a global map with filters</p>
        </Link>

        <Link to="/summarizer" className="feature-card">
          <Brain className="feature-icon" />
          <h3>AI Report Summarizer</h3>
          <p>Upload ESG reports for AI-powered summaries</p>
        </Link>

        <Link to="/news" className="feature-card">
          <Newspaper className="feature-icon" />
          <h3>ESG News</h3>
          <p>Stay updated with latest ESG news and trends</p>
        </Link>

        <Link to="/report" className="feature-card">
          <FileDown className="feature-icon" />
          <h3>PDF Reports</h3>
          <p>Generate and download comprehensive ESG reports</p>
        </Link>
      </div>

      <div className="cta-section">
        <h2>Ready to explore ESG insights?</h2>
        <p>Start by searching for a company or explore our advanced features</p>
        <div className="cta-buttons">
          <Link to="/search" className="cta-button primary">Search Companies</Link>
          <Link to="/dashboard" className="cta-button secondary">View Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 