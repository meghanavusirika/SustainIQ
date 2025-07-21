import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './InteractiveMap.css';

interface CompanyLocation {
  id: number;
  name: string;
  ticker: string;
  industry: string;
  esgScore: number;
  coordinates: [number, number];
  country: string;
  city: string;
  headquarters: string;
}

interface MapData {
  companies: CompanyLocation[];
  filters: {
    industries: string[];
    regions: string[];
    scoreRange: { min: number; max: number };
  };
  metadata: {
    totalCompanies: number;
    appliedFilters: {
      industry: string;
      scoreRange: string;
      region: string;
    };
  };
}

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const InteractiveMap: React.FC = () => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyLocation | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    fetchMapData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!mapData || !MAPBOX_TOKEN) return;
    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (e) {
        // ignore error if already removed
      }
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 20],
      zoom: 1.5,
    });
    mapRef.current = map;

    map.on('load', () => {
      // Pins temporarily removed
    });
    return () => {
      if (map && map.remove) {
        try {
          map.remove();
        } catch (e) {
          // ignore error if already removed
        }
      }
    };
  }, [mapData]);

  const fetchMapData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/api/map/companies');
      const data = await response.json();
      setMapData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch map data');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Poor';
  };

  if (!MAPBOX_TOKEN) {
    return <div className="map-error">Mapbox token missing. Please set REACT_APP_MAPBOX_TOKEN in your .env file.</div>;
  }

  if (loading) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Loading ESG Map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-error">
        <p>Error loading map: {error}</p>
        <button onClick={fetchMapData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="interactive-map">
      <div className="map-header">
        <h1>Interactive ESG Map</h1>
        <p>Explore ESG scores of companies worldwide</p>
        <div className="map-stats">
          <div className="stat">
            <span>{mapData?.metadata.totalCompanies || 0} Companies</span>
          </div>
          <div className="stat">
            <span>
              {mapData?.filters?.industries && mapData.filters.industries.length > 0
                ? mapData.filters.industries.length - 1
                : 0} Industries
            </span>
          </div>
        </div>
      </div>
      <div ref={mapContainer} className="mapbox-map" style={{ width: '100%', borderRadius: '12px', margin: '24px 0' }} />
      {selectedCompany && (
        <div className="company-popup">
          <div className="popup-header">
            <h3>{selectedCompany.name}</h3>
            <button onClick={() => setSelectedCompany(null)}>×</button>
          </div>
          <div className="popup-content">
            <div className="company-info">
              <p><strong>Ticker:</strong> {selectedCompany.ticker}</p>
              <p><strong>Industry:</strong> {selectedCompany.industry}</p>
              <p><strong>Location:</strong> {selectedCompany.headquarters}</p>
            </div>
            <div className="esg-score">
              <div className="score-circle" style={{ 
                background: `conic-gradient(${getScoreColor(selectedCompany.esgScore)} ${selectedCompany.esgScore * 3.6}deg, #e5e7eb ${selectedCompany.esgScore * 3.6}deg)`
              }}>
                <div className="score-inner">
                  <span className="score-number">{selectedCompany.esgScore}</span>
                  <span className="score-label">{getScoreLabel(selectedCompany.esgScore)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="map-legend">
        <h4>ESG Score Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
            <span>Excellent (80-100)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>Good (60-79)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Poor (0-59)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap; 