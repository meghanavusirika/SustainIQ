import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CompanySearch from './pages/CompanySearch';
import ESGDashboard from './pages/ESGDashboard';
import CompanyComparison from './pages/CompanyComparison';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="main-navbar">
        <Link to="/" className="brand">SustainIQ</Link>
        <nav>
          <Link to="/search">Company Search</Link>
          <Link to="/dashboard">ESG Dashboard</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/benchmark">Benchmark</Link>
          <Link to="/report">Report</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<CompanySearch />} />
        <Route path="/dashboard/:companyId" element={<ESGDashboard />} />
        <Route path="/dashboard" element={<ESGDashboard />} />
        <Route path="/compare" element={<CompanyComparison />} />
      </Routes>
    </Router>
  );
};

export default App;
