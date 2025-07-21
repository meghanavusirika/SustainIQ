import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
console.log('Loaded NEWS_API_KEY:', NEWS_API_KEY); // DEBUG LOG
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

if (!NEWS_API_KEY) {
  throw new Error('NewsAPI key not set in environment variables');
}

export async function fetchESGNews(company: string, pageSize = 10): Promise<any[]> {
  const query = `"${company}" AND (ESG OR sustainability OR environment OR governance OR controversy)`;
  const response = await axios.get(NEWS_API_URL, {
    params: {
      q: query,
      sortBy: 'publishedAt',
      language: 'en',
      pageSize,
      apiKey: NEWS_API_KEY,
    },
  });
  return response.data.articles || [];
} 