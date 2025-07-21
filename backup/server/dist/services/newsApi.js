"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchESGNews = fetchESGNews;
const axios_1 = __importDefault(require("axios"));
const NEWS_API_KEY = process.env.NEWS_API_KEY;
console.log('Loaded NEWS_API_KEY:', NEWS_API_KEY); // DEBUG LOG
const NEWS_API_URL = 'https://newsapi.org/v2/everything';
if (!NEWS_API_KEY) {
    throw new Error('NewsAPI key not set in environment variables');
}
async function fetchESGNews(company, pageSize = 10) {
    const query = `"${company}" AND (ESG OR sustainability OR environment OR governance OR controversy)`;
    const response = await axios_1.default.get(NEWS_API_URL, {
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
