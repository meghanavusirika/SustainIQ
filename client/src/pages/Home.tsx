import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>SustainIQ</h1>
        <p className="subtitle">Corporate ESG Tracker & Sustainability Insights</p>
      </header>
      <section className="home-description">
        <p>
          Welcome to <b>SustainIQ</b> — your one-stop platform to search, explore, and compare ESG (Environmental, Social, Governance) scores of public companies. Visualize trends, benchmark industries, and download professional ESG reports.
        </p>
      </section>
      <nav className="home-nav">
        <a href="/search">🔍 Company Search</a>
        <a href="/dashboard">📊 ESG Dashboard</a>
        <a href="/compare">🆚 Compare Companies</a>
        <a href="/benchmark">🌱 Industry Benchmarking</a>
        <a href="/report">📄 Download Report</a>
      </nav>
    </div>
  );
};

export default Home; 