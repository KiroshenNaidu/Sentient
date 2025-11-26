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
      throw new Error('Input text array cannot be empty.');
    }

    const CHUNK_SIZE = 100;
    const results = [];

    // Process texts in chunks to avoid hitting API limits
    for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
      const chunk = texts.slice(i, i + CHUNK_SIZE);
      const chunkResults = await analyzeTextSentimentBatch({ texts: chunk });
      if (!chunkResults || chunkResults.length === 0) {
        // We can either throw an error or just continue. Let's continue for robustness.
        console.warn(`Analysis returned no results for a chunk starting at index ${i}.`);
        continue;
      }
      results.push(...chunkResults);
    }
    
    if (results.length === 0) {
      throw new Error('Failed to analyze sentiments for all chunks.');
    }

    // Since we processed in chunks, the original_index from the AI is relative to the chunk.
    // We need to map it back to the absolute index in the original `texts` array.
    // The AI results are not guaranteed to be in order, so we sort them by their original_index first.
    const sortedResults = results.sort((a, b) => a.original_index - b.original_index);

    return sortedResults.map(result => ({
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
