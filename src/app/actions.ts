'use server';

import { analyzeTextSentiment } from '@/ai/flows/analyze-text-sentiment';
import { analyzeTextSentimentBatch } from '@/ai/flows/analyze-text-sentiment-batch';
import type { AnalysisResult, Sentiment } from '@/lib/types';

export async function analyzeSingleText(
  text: string
): Promise<Omit<AnalysisResult, 'id' | 'text'>> {
  try {
    if (!text.trim()) {
      throw new Error('Input text cannot be empty.');
    }

    const result = await analyzeTextSentiment({ text });
     if (!result) {
      throw new Error('Failed to analyze sentiment.');
    }
    
    return {
      sentiment: result.sentiment as Sentiment,
      confidence: result.confidence,
      drivers: result.drivers,
      explanation: result.explanation,
    };
  } catch (error) {
    console.error('Error in analyzeSingleText:', error);
    if (error instanceof Error) {
        throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during analysis.');
  }
}

export async function analyzeMultipleTexts(
  texts: string[]
): Promise<Omit<AnalysisResult, 'id' | 'text'>[]> {
  try {
    if (texts.length === 0) {
      throw new Error('Input text cannot be empty.');
    }

    const results = await analyzeTextSentimentBatch({ texts });
    if (!results || results.length === 0) {
      throw new Error('Failed to analyze sentiments.');
    }

    return results.map(result => ({
      sentiment: result.sentiment as Sentiment,
      confidence: result.confidence,
      drivers: result.drivers,
      explanation: result.explanation,
    }));
  } catch (error) {
    console.error('Error in analyzeMultipleTexts:', error);
    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during analysis.');
  }
}
