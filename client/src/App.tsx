import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ESGDashboardUnified from './pages/CompanySearch';
import CompanyComparison from './pages/CompanyComparison';
import ESGNews from './pages/ESGNews';
import PDFReport from './pages/PDFReport';
import IndustryBenchmarking from './pages/IndustryBenchmarking';
import ESGReportSummarizer from './pages/ESGReportSummarizer';
import InteractiveMap from './pages/InteractiveMap';
import ESGReportChat from './pages/ESGReportChat';
import ESGDashboard from './pages/ESGDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ESGDashboardUnified />} />
          <Route path="/dashboard/:id" element={<ESGDashboard />} />
          <Route path="/search" element={<ESGDashboardUnified />} />
          <Route path="/compare" element={<CompanyComparison />} />
          <Route path="/news" element={<ESGNews />} />
          <Route path="/report" element={<PDFReport />} />
          <Route path="/benchmark" element={<IndustryBenchmarking />} />
          <Route path="/summarizer" element={<ESGReportSummarizer />} />
          <Route path="/map" element={<InteractiveMap />} />
          <Route path="/chat" element={<ESGReportChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
