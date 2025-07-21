import React, { useState } from 'react';
import { Upload, FileText, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import './ESGReportSummarizer.css';

interface SummaryResult {
  summary: string;
  originalLength: number;
  truncatedLength: number;
}

const ESGReportSummarizer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }
    setSelectedFile(file);
    setError(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const uploadAndSummarize = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setSummary(null);

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await fetch('http://localhost:5001/api/esg-report/summarize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process PDF');
      }

      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSummary = () => {
    if (!summary) return;

    const blob = new Blob([summary.summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'esg-report-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="esg-report-summarizer">
      <div className="summarizer-header">
        <h1>ESG Report Summarizer</h1>
        <p>Upload an ESG report PDF and get an AI-powered summary of key insights</p>
      </div>

      <div className="upload-section">
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'file-selected' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            accept=".pdf"
            onChange={handleFileInput}
            className="file-input"
          />
          
          <div className="upload-content">
            <Upload size={48} className="upload-icon" />
            <h3>Upload ESG Report PDF</h3>
            <p>Drag and drop your PDF here, or click to browse</p>
            <p className="file-requirements">Maximum file size: 10MB</p>
          </div>

          {selectedFile && (
            <div className="selected-file">
              <FileText size={20} />
              <span>{selectedFile.name}</span>
              <span className="file-size">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button
          className="summarize-btn"
          onClick={uploadAndSummarize}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 size={20} className="spinner" />
              Processing PDF...
            </>
          ) : (
            <>
              <FileText size={20} />
              Summarize Report
            </>
          )}
        </button>
      </div>

      {summary && (
        <div className="summary-section">
          <div className="summary-header">
            <h2>AI-Generated Summary</h2>
            <div className="summary-stats">
              <span>Original: {summary.originalLength.toLocaleString()} characters</span>
              <span>Summary: {summary.summary.length.toLocaleString()} characters</span>
              <span>Compression: {((1 - summary.summary.length / summary.originalLength) * 100).toFixed(1)}%</span>
            </div>
            <button className="download-btn" onClick={downloadSummary}>
              <Download size={16} />
              Download Summary
            </button>
          </div>

          <div className="summary-content">
            <div className="summary-text">
              {summary.summary.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="summary-footer">
            <div className="ai-note">
              <CheckCircle size={16} />
              <span>Generated using AI-powered text analysis</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ESGReportSummarizer; 