// Mock map service - will be replaced with OpenCorporates API when available

interface CompanyLocation {
  id: number;
  name: string;
  ticker: string;
  industry: string;
  esgScore: number;
  coordinates: [number, number]; // [longitude, latitude]
  country: string;
  city: string;
  headquarters: string;
}

export function getCompanyLocations(): CompanyLocation[] {
  return [
    {
      id: 1,
      name: 'Apple Inc.',
      ticker: 'AAPL',
      industry: 'Technology',
      esgScore: 85,
      coordinates: [-122.0833, 37.3382], // Cupertino, CA
      country: 'United States',
      city: 'Cupertino',
      headquarters: 'Cupertino, California'
    },
    {
      id: 2,
      name: 'Microsoft Corporation',
      ticker: 'MSFT',
      industry: 'Technology',
      esgScore: 88,
      coordinates: [-122.1215, 47.6062], // Redmond, WA
      country: 'United States',
      city: 'Redmond',
      headquarters: 'Redmond, Washington'
    },
    {
      id: 3,
      name: 'Tesla Inc.',
      ticker: 'TSLA',
      industry: 'Automotive',
      esgScore: 72,
      coordinates: [-122.1430, 37.4419], // Palo Alto, CA
      country: 'United States',
      city: 'Palo Alto',
      headquarters: 'Palo Alto, California'
    },
    {
      id: 4,
      name: 'Johnson & Johnson',
      ticker: 'JNJ',
      industry: 'Healthcare',
      esgScore: 91,
      coordinates: [-74.4057, 40.0583], // New Brunswick, NJ
      country: 'United States',
      city: 'New Brunswick',
      headquarters: 'New Brunswick, New Jersey'
    },
    {
      id: 5,
      name: 'Procter & Gamble',
      ticker: 'PG',
      industry: 'Consumer Goods',
      esgScore: 87,
      coordinates: [-84.5120, 39.1031], // Cincinnati, OH
      country: 'United States',
      city: 'Cincinnati',
      headquarters: 'Cincinnati, Ohio'
    },
    {
      id: 6,
      name: 'Nike Inc.',
      ticker: 'NKE',
      industry: 'Consumer Goods',
      esgScore: 79,
      coordinates: [-122.6765, 45.5152], // Beaverton, OR
      country: 'United States',
      city: 'Beaverton',
      headquarters: 'Beaverton, Oregon'
    },
    {
      id: 7,
      name: 'Coca-Cola Company',
      ticker: 'KO',
      industry: 'Beverages',
      esgScore: 83,
      coordinates: [-84.3880, 33.7490], // Atlanta, GA
      country: 'United States',
      city: 'Atlanta',
      headquarters: 'Atlanta, Georgia'
    },
    {
      id: 8,
      name: 'Walmart Inc.',
      ticker: 'WMT',
      industry: 'Retail',
      esgScore: 76,
      coordinates: [-94.1735, 36.0625], // Bentonville, AR
      country: 'United States',
      city: 'Bentonville',
      headquarters: 'Bentonville, Arkansas'
    },
    {
      id: 9,
      name: 'Amazon.com Inc.',
      ticker: 'AMZN',
      industry: 'Technology',
      esgScore: 68,
      coordinates: [-122.3321, 47.6062], // Seattle, WA
      country: 'United States',
      city: 'Seattle',
      headquarters: 'Seattle, Washington'
    },
    {
      id: 10,
      name: 'Google (Alphabet)',
      ticker: 'GOOGL',
      industry: 'Technology',
      esgScore: 82,
      coordinates: [-122.0841, 37.4219], // Mountain View, CA
      country: 'United States',
      city: 'Mountain View',
      headquarters: 'Mountain View, California'
    },
    // International companies
    {
      id: 11,
      name: 'Nestlé S.A.',
      ticker: 'NESN',
      industry: 'Consumer Goods',
      esgScore: 89,
      coordinates: [6.1432, 46.2044], // Vevey, Switzerland
      country: 'Switzerland',
      city: 'Vevey',
      headquarters: 'Vevey, Switzerland'
    },
    {
      id: 12,
      name: 'Unilever PLC',
      ticker: 'ULVR',
      industry: 'Consumer Goods',
      esgScore: 86,
      coordinates: [-0.1181, 51.5074], // London, UK
      country: 'United Kingdom',
      city: 'London',
      headquarters: 'London, United Kingdom'
    },
    {
      id: 13,
      name: 'Samsung Electronics',
      ticker: '005930',
      industry: 'Technology',
      esgScore: 78,
      coordinates: [127.0246, 37.5665], // Seoul, South Korea
      country: 'South Korea',
      city: 'Seoul',
      headquarters: 'Seoul, South Korea'
    },
    {
      id: 14,
      name: 'Toyota Motor Corporation',
      ticker: '7203',
      industry: 'Automotive',
      esgScore: 84,
      coordinates: [137.2089, 35.1815], // Toyota City, Japan
      country: 'Japan',
      city: 'Toyota City',
      headquarters: 'Toyota City, Japan'
    },
    {
      id: 15,
      name: 'Volkswagen Group',
      ticker: 'VOW3',
      industry: 'Automotive',
      esgScore: 71,
      coordinates: [8.6821, 50.1109], // Wolfsburg, Germany
      country: 'Germany',
      city: 'Wolfsburg',
      headquarters: 'Wolfsburg, Germany'
    }
  ];
}

export function filterCompaniesByIndustry(companies: CompanyLocation[], industry: string): CompanyLocation[] {
  if (!industry || industry === 'All') return companies;
  return companies.filter(company => company.industry === industry);
}

export function filterCompaniesByScore(companies: CompanyLocation[], minScore: number, maxScore: number): CompanyLocation[] {
  return companies.filter(company => company.esgScore >= minScore && company.esgScore <= maxScore);
}

export function filterCompaniesByRegion(companies: CompanyLocation[], region: string): CompanyLocation[] {
  if (!region || region === 'All') return companies;
  
  const regionMap: { [key: string]: string[] } = {
    'North America': ['United States', 'Canada', 'Mexico'],
    'Europe': ['United Kingdom', 'Germany', 'Switzerland', 'France', 'Netherlands'],
    'Asia': ['Japan', 'South Korea', 'China', 'India'],
    'Other': ['Australia', 'Brazil', 'South Africa']
  };
  
  const countries = regionMap[region] || [];
  return companies.filter(company => countries.includes(company.country));
} 