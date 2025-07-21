import { Request, Response } from 'express';
import { fetchESGNews } from '../services/newsApi';
import { analyzeSentiment } from '../services/huggingface';

// Helper to compute risk score
function computeRiskScore(esgScore: number, avgSentiment: number, controversyCount: number): number {
  // Lower ESG score, more negative sentiment, and more controversies = higher risk
  // ESG score: 0-100, avgSentiment: -1 (very negative) to 1 (very positive), controversyCount: integer
  let risk = 100 - esgScore; // base risk is inverse of ESG score
  risk += (1 - avgSentiment) * 20; // negative sentiment increases risk
  risk += Math.min(controversyCount * 5, 30); // each controversy adds risk, capped
  return Math.max(0, Math.min(100, Math.round(risk)));
}

export const getCompanyRiskRating = async (req: Request, res: Response) => {
  try {
    const { company, esgScore } = req.query;
    if (!company || !esgScore) {
      return res.status(400).json({ error: 'Missing company or esgScore parameter' });
    }
    const companyName = String(company);
    const esgScoreNum = Number(esgScore);

    // Fetch ESG news
    const articles = await fetchESGNews(companyName, 10);
    const headlines = articles.map((a) => a.title).filter(Boolean);

    // Analyze sentiment for each headline
    let sentimentSum = 0;
    let controversyCount = 0;
    for (const headline of headlines) {
      const sentimentResult = await analyzeSentiment(headline);
      // Sentiment: { label: 'POSITIVE' | 'NEGATIVE', score: number }
      sentimentSum += sentimentResult.label === 'POSITIVE' ? 1 : -1;
      // Simple controversy detection
      if (/controversy|scandal|lawsuit|probe|fraud|violation|fine|penalty|recall|boycott/i.test(headline)) {
        controversyCount++;
      }
    }
    const avgSentiment = headlines.length ? sentimentSum / headlines.length : 0;

    // Compute risk score
    const riskScore = computeRiskScore(esgScoreNum, avgSentiment, controversyCount);

    res.json({
      company: companyName,
      esgScore: esgScoreNum,
      riskScore,
      avgSentiment,
      controversyCount,
      newsSample: headlines.slice(0, 5),
    });
  } catch (error) {
    console.error('Error in getCompanyRiskRating:', error);
    res.status(500).json({ error: 'Failed to compute risk rating', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 