// Centralized mock company data for use across the app
export interface MockCompany {
  id: number;
  name: string;
  ticker: string;
  sector: string;
  location?: string;
}

export const mockCompanies: MockCompany[] = [
  { id: 1, name: 'Apple Inc.', ticker: 'AAPL', sector: 'Technology', location: 'Cupertino, CA' },
  { id: 2, name: 'Microsoft Corporation', ticker: 'MSFT', sector: 'Technology', location: 'Redmond, WA' },
  { id: 3, name: 'Tesla Inc.', ticker: 'TSLA', sector: 'Automotive', location: 'Austin, TX' },
  { id: 4, name: 'Johnson & Johnson', ticker: 'JNJ', sector: 'Healthcare', location: 'New Brunswick, NJ' },
  { id: 5, name: 'Procter & Gamble', ticker: 'PG', sector: 'Consumer Goods', location: 'Cincinnati, OH' },
  { id: 6, name: 'Amazon.com Inc.', ticker: 'AMZN', sector: 'E-commerce', location: 'Seattle, WA' },
  { id: 7, name: 'Alphabet Inc.', ticker: 'GOOGL', sector: 'Technology', location: 'Mountain View, CA' },
  { id: 8, name: 'Walmart Inc.', ticker: 'WMT', sector: 'Retail', location: 'Bentonville, AR' },
  { id: 9, name: 'Coca-Cola Company', ticker: 'KO', sector: 'Beverages', location: 'Atlanta, GA' },
  { id: 10, name: 'Walt Disney Company', ticker: 'DIS', sector: 'Entertainment', location: 'Burbank, CA' },
  { id: 11, name: 'AbbVie Inc.', ticker: 'ABBV', sector: 'Healthcare', location: 'North Chicago, IL' },
  { id: 12, name: 'Comcast Corporation', ticker: 'CMCSA', sector: 'Telecom', location: 'Philadelphia, PA' },
  { id: 13, name: 'Oracle Corporation', ticker: 'ORCL', sector: 'Technology', location: 'Austin, TX' },
  { id: 14, name: 'Cisco Systems', ticker: 'CSCO', sector: 'Technology', location: 'San Jose, CA' },
  { id: 15, name: 'Merck & Co.', ticker: 'MRK', sector: 'Healthcare', location: 'Kenilworth, NJ' },
  { id: 16, name: 'Broadcom Inc.', ticker: 'AVGO', sector: 'Technology', location: 'San Jose, CA' },
  { id: 17, name: 'Thermo Fisher Scientific', ticker: 'TMO', sector: 'Healthcare', location: 'Waltham, MA' },
  { id: 18, name: 'Costco Wholesale', ticker: 'COST', sector: 'Retail', location: 'Issaquah, WA' },
  { id: 19, name: 'Accenture plc', ticker: 'ACN', sector: 'Consulting', location: 'Dublin, Ireland' },
  { id: 20, name: 'Qualcomm Inc.', ticker: 'QCOM', sector: 'Technology', location: 'San Diego, CA' },
  { id: 21, name: 'Starbucks Corporation', ticker: 'SBUX', sector: 'Consumer Goods', location: 'Seattle, WA' },
  { id: 22, name: 'Texas Instruments', ticker: 'TXN', sector: 'Technology', location: 'Dallas, TX' },
  { id: 23, name: 'Bristol-Myers Squibb', ticker: 'BMY', sector: 'Healthcare', location: 'New York, NY' },
  { id: 24, name: 'Honeywell International', ticker: 'HON', sector: 'Industrial', location: 'Charlotte, NC' },
  { id: 25, name: 'Union Pacific', ticker: 'UNP', sector: 'Transport', location: 'Omaha, NE' },
  { id: 26, name: '3M Company', ticker: 'MMM', sector: 'Industrial', location: 'St. Paul, MN' },
  { id: 27, name: 'Caterpillar Inc.', ticker: 'CAT', sector: 'Industrial', location: 'Irving, TX' },
  { id: 28, name: 'Goldman Sachs Group', ticker: 'GS', sector: 'Financial', location: 'New York, NY' },
  { id: 29, name: 'Morgan Stanley', ticker: 'MS', sector: 'Financial', location: 'New York, NY' },
  { id: 30, name: 'American Express', ticker: 'AXP', sector: 'Financial', location: 'New York, NY' },
  { id: 31, name: 'Boeing Company', ticker: 'BA', sector: 'Aerospace', location: 'Arlington, VA' },
  { id: 32, name: 'General Electric', ticker: 'GE', sector: 'Industrial', location: 'Boston, MA' },
  { id: 33, name: 'Lockheed Martin', ticker: 'LMT', sector: 'Aerospace', location: 'Bethesda, MD' },
  { id: 34, name: 'Raytheon Technologies', ticker: 'RTX', sector: 'Aerospace', location: 'Arlington, VA' },
  { id: 35, name: 'Ford Motor Company', ticker: 'F', sector: 'Automotive', location: 'Dearborn, MI' },
  { id: 36, name: 'General Motors', ticker: 'GM', sector: 'Automotive', location: 'Detroit, MI' },
  { id: 37, name: 'Delta Air Lines', ticker: 'DAL', sector: 'Transport', location: 'Atlanta, GA' },
  { id: 38, name: 'United Airlines', ticker: 'UAL', sector: 'Transport', location: 'Chicago, IL' },
  { id: 39, name: 'Southwest Airlines', ticker: 'LUV', sector: 'Transport', location: 'Dallas, TX' },
]; 