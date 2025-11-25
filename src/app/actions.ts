'use server';

import { analyzeTextSentiment } from '@/ai/flows/analyze-text-sentiment';
import { extractKeySentimentDrivers } from '@/ai/flows/extract-key-sentiment-drivers';
import { explainSentimentScores } from '@/ai/flows/explain-sentiment-scores';
import type { AnalysisResult, Sentiment } from '@/lib/types';

export async function analyzeSingleText(
  text: string
): Promise<Omit<AnalysisResult, 'id' | 'text'>> {
  try {
    if (!text.trim()) {
      throw new Error('Input text cannot be empty.');
    }

    const sentimentResult = await analyzeTextSentiment({ text });
    if (!sentimentResult || !sentimentResult.sentiment) {
      throw new Error('Failed to analyze sentiment.');
    }

    const driversResult = await extractKeySentimentDrivers({
      text,
      sentiment: sentimentResult.sentiment as Sentiment,
    });
    if (!driversResult || !driversResult.drivers) {
      throw new Error('Failed to extract keywords.');
    }

    const explanationResult = await explainSentimentScores({
      text,
      keywords: driversResult.drivers,
    });
    if (!explanationResult || !explanationResult.explanation) {
      throw new Error('Failed to generate explanation.');
    }
    
    return {
      sentiment: sentimentResult.sentiment as Sentiment,
      confidence: sentimentResult.confidence,
      drivers: driversResult.drivers,
      explanation: explanationResult.explanation,
    };
  } catch (error) {
    console.error('Error in analyzeSingleText:', error);
    if (error instanceof Error) {
        throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during analysis.');
  }
}
