'use server';

/**
 * @fileOverview Performs sentiment analysis on input text, classifying it as positive, negative, or neutral,
 *               and provides a confidence score for the classification.
 *
 * - analyzeTextSentiment - A function that accepts text input and returns sentiment analysis results.
 * - AnalyzeTextSentimentInput - The input type for the analyzeTextSentiment function.
 * - AnalyzeTextSentimentOutput - The return type for the analyzeTextSentiment function, including sentiment and confidence score.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { extractKeySentimentDrivers } from './extract-key-sentiment-drivers';
import { explainSentimentScores } from './explain-sentiment-scores';

const AnalyzeTextSentimentInputSchema = z.object({
  text: z.string().describe('The text to analyze for sentiment.'),
});
export type AnalyzeTextSentimentInput = z.infer<typeof AnalyzeTextSentimentInputSchema>;

const AnalyzeTextSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the text.'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence score of the sentiment analysis, from 0 to 1.'),
  drivers: z.array(z.string()).describe('Key phrases and words driving the sentiment.'),
  explanation: z.string().describe('An explanation of the sentiment analysis.'),
});
export type AnalyzeTextSentimentOutput = z.infer<typeof AnalyzeTextSentimentOutputSchema>;

export async function analyzeTextSentiment(input: AnalyzeTextSentimentInput): Promise<AnalyzeTextSentimentOutput> {
  return analyzeTextSentimentFlow(input);
}

const sentimentAnalysisPrompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  input: {schema: AnalyzeTextSentimentInputSchema},
  output: {schema: z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number().min(0).max(1),
  })},
  prompt: `Determine the sentiment of the following text. Classify the sentiment as positive, negative, or neutral. Provide a confidence score between 0 and 1 representing the certainty of your classification.

Text: {{{text}}}

Output in JSON format.
`,
});


const analyzeTextSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeTextSentimentFlow',
    inputSchema: AnalyzeTextSentimentInputSchema,
    outputSchema: AnalyzeTextSentimentOutputSchema,
  },
  async input => {
    const sentimentResult = (await sentimentAnalysisPrompt(input)).output!;

    const driversResult = await extractKeySentimentDrivers({
      text: input.text,
      sentiment: sentimentResult.sentiment,
    });

    const explanationResult = await explainSentimentScores({
      text: input.text,
      keywords: driversResult.drivers,
    });
    
    return {
      sentiment: sentimentResult.sentiment,
      confidence: sentimentResult.confidence,
      drivers: driversResult.drivers,
      explanation: explanationResult.explanation,
    };
  }
);
