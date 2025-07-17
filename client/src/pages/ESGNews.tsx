import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import './ESGNews.css';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

const ESGNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('esg OR sustainability OR "environmental social governance"');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const apiKey = process.env.REACT_APP_NEWSAPI_KEY;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${apiKey}`;
        const response = await axios.get(url);
        setArticles(response.data.articles);
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
      }
      setLoading(false);
    };
    fetchNews();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search || 'esg OR sustainability OR "environmental social governance"');
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>📰 ESG News & Sentiment</h1>
        <p>Latest news on ESG, sustainability, and responsible investing</p>
        <form className="news-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search ESG news, companies, or topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit"><Search size={18} /></button>
        </form>
      </div>
      {loading ? (
        <div className="news-loading">
          <div className="loading-spinner"></div>
          <p>Loading news...</p>
        </div>
      ) : error ? (
        <div className="news-error">{error}</div>
      ) : (
        <div className="articles-grid">
          {articles.map((article, idx) => (
            <a key={idx} href={article.url} className="article-card" target="_blank" rel="noopener noreferrer">
              {article.urlToImage && <img src={article.urlToImage} alt={article.title} className="article-img" />}
              <div className="article-content">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <div className="article-meta">
                  <span className="source">{article.source.name}</span>
                  <span className="date">{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ESGNews; 