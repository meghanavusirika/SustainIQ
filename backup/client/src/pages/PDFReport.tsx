import React, { useState } from 'react';
import { Download, FileText, Settings, Eye } from 'lucide-react';
import './PDFReport.css';

interface ReportOptions {
  includeCharts: boolean;
  includeTrends: boolean;
  includeComparison: boolean;
  includeNews: boolean;
  reportType: 'summary' | 'detailed' | 'executive';
}

const PDFReport: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState('Apple Inc. (AAPL)');
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    includeCharts: true,
    includeTrends: true,
    includeComparison: false,
    includeNews: true,
    reportType: 'detailed'
  });
  const [generating, setGenerating] = useState(false);

  const companies = [
    'Apple Inc. (AAPL)',
    'Microsoft Corporation (MSFT)',
    'Tesla Inc. (TSLA)',
    'Johnson & Johnson (JNJ)',
    'Procter & Gamble (PG)'
  ];

  const handleGenerateReport = async () => {
    setGenerating(true);
    // Simulate PDF generation
    setTimeout(() => {
      setGenerating(false);
      // In a real app, this would trigger PDF generation and download
      alert('Report generated! In a real implementation, this would download a PDF.');
    }, 3000);
  };

  const updateOption = (key: keyof ReportOptions, value: boolean | string) => {
    setReportOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>📄 ESG Report Generator</h1>
        <p>Generate professional ESG reports for companies with customizable options</p>
      </div>

      <div className="report-content">
        <div className="report-settings">
          <div className="settings-section">
            <h3><Settings size={20} /> Report Settings</h3>
            
            <div className="setting-group">            <label>Select Company:</label>
              <select 
                value={selectedCompany} 
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="company-select">
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            <div className="setting-group">            <label>Report Type:</label>
              <select 
                value={reportOptions.reportType} 
                onChange={(e) => updateOption('reportType', e.target.value)}
                className="report-type-select">
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="executive">Executive Summary</option>
              </select>
            </div>

            <div className="setting-group">            <label>Include Sections:</label>
              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={reportOptions.includeCharts}
                    onChange={(e) => updateOption('includeCharts', e.target.checked)}
                  />
                  <span>Charts & Visualizations</span>
                </label>
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={reportOptions.includeTrends}
                    onChange={(e) => updateOption('includeTrends', e.target.checked)}
                  />
                  <span>Trend Analysis</span>
                </label>
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={reportOptions.includeComparison}
                    onChange={(e) => updateOption('includeComparison', e.target.checked)}
                  />
                  <span>Industry Comparison</span>
                </label>
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={reportOptions.includeNews}
                    onChange={(e) => updateOption('includeNews', e.target.checked)}
                  />
                  <span>Recent News</span>
                </label>
              </div>
            </div>
          </div>

          <div className="generate-section">
            <button 
              onClick={handleGenerateReport}
              disabled={generating}
              className="generate-btn"
            >
              {generating ? (
                <>
                  <div className="loading-spinner"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Generate PDF Report
                </>
              )}
            </button>
          </div>
        </div>

        <div className="report-preview">
          <div className="preview-header">
            <h3><Eye size={20} /> Report Preview</h3>
            <span className="preview-label">Preview of {selectedCompany} ESG Report</span>
          </div>
          
          <div className="preview-content">
            <div className="preview-page">              <div className="preview-header-section">
                <h2>ESG Sustainability Report</h2>
                <h3>{selectedCompany}</h3>
                <p>Generated on {new Date().toLocaleDateString()}</p>
              </div>

              <div className="preview-section">
                <h4>Executive Summary</h4>
                <p>This report provides a comprehensive analysis of {selectedCompany}'s Environmental, Social, and Governance (ESG) performance, highlighting key metrics, trends, and areas for improvement.</p>
              </div>

              <div className="preview-section">
                <h4>ESG Score Overview</h4>
                <div className="score-preview">
                  <div className="score-item">
                    <span className="score-label">Overall ESG Score</span>
                    <span className="score-value">85</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Environmental</span>
                    <span className="score-value">85</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Social</span>
                    <span className="score-value">78</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Governance</span>
                    <span className="score-value">92</span>
                  </div>
                </div>
              </div>

              {reportOptions.includeCharts && (
                <div className="preview-section">
                  <h4>ESG Performance Charts</h4>
                  <div className="chart-placeholder">
                    <FileText size={40} />
                    <p>Charts and visualizations will be included in the final report</p>
                  </div>
                </div>
              )}

              {reportOptions.includeTrends && (
                <div className="preview-section">
                  <h4>Performance Trends</h4>
                  <p>Historical ESG performance data and trend analysis will be included in the detailed report.</p>
                </div>
              )}

              {reportOptions.includeComparison && (
                <div className="preview-section">
                  <h4>Industry Comparison</h4>
                  <p>Comparison with industry peers and sector benchmarks will be provided.</p>
                </div>
              )}

              {reportOptions.includeNews && (
                <div className="preview-section">
                  <h4>Recent ESG News</h4>
                  <p>Latest news and developments related to the company's ESG initiatives will be included.</p>
                </div>
              )}

              <div className="preview-section">
                <h4>Recommendations</h4>
                <ul>
                  <li>Continue investing in renewable energy initiatives</li>
                  <li>Enhance diversity and inclusion programs</li>
                  <li>Strengthen board oversight of ESG matters</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReport; 