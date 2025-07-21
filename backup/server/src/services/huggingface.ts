import axios from 'axios';
import { execSync } from 'child_process';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  throw new Error('HuggingFace API token not set in environment variables');
}

export async function summarizeText(text: string): Promise<string> {
  const summarizationUrl = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
  const response = await axios.post(
    summarizationUrl,
    {
      inputs: text,
      parameters: {
        max_length: 300,
        min_length: 100
      }
    },
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );
  const summary = response.data[0]?.summary_text || '';
  return summary;
}

export async function analyzeSentiment(text: string): Promise<{ label: string; score: number }> {
  try {
    const output = execSync(`python3 ../sentiment.py "${text.replace(/"/g, '\\"')}"`).toString().trim();
    const [label, score] = output.split(' ');
    return { label, score: parseFloat(score) };
  } catch (error) {
    throw new Error('Failed to run local sentiment analysis: ' + (error instanceof Error ? error.message : error));
  }
} 