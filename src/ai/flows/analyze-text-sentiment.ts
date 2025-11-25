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
});
export type AnalyzeTextSentimentOutput = z.infer<typeof AnalyzeTextSentimentOutputSchema>;

export async function analyzeTextSentiment(input: AnalyzeTextSentimentInput): Promise<AnalyzeTextSentimentOutput> {
  return analyzeTextSentimentFlow(input);
}

const analyzeTextSentimentPrompt = ai.definePrompt({
  name: 'analyzeTextSentimentPrompt',
  input: {schema: AnalyzeTextSentimentInputSchema},
  output: {schema: AnalyzeTextSentimentOutputSchema},
  prompt: `Determine the sentiment of the following text. Classify the sentiment as positive, negative, or neutral. Provide a confidence score between 0 and 1 representing the certainty of your classification.

Text: {{{text}}}

Output in JSON format with "sentiment" (positive, negative, or neutral) and "confidence" (number between 0 and 1) fields.
`,
});

const analyzeTextSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeTextSentimentFlow',
    inputSchema: AnalyzeTextSentimentInputSchema,
    outputSchema: AnalyzeTextSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeTextSentimentPrompt(input);
    return output!;
  }
);
