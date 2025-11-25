'use server';

/**
 * @fileOverview Extracts key phrases and words that drive sentiment analysis.
 *
 * - extractKeySentimentDrivers - A function that extracts key sentiment drivers from text.
 * - ExtractKeySentimentDriversInput - The input type for the extractKeySentimentDrivers function.
 * - ExtractKeySentimentDriversOutput - The return type for the extractKeySentimentDrivers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractKeySentimentDriversInputSchema = z.object({
  text: z.string().describe('The text to analyze for key sentiment drivers.'),
  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('The sentiment of the text.'),
});
export type ExtractKeySentimentDriversInput = z.infer<typeof ExtractKeySentimentDriversInputSchema>;

const ExtractKeySentimentDriversOutputSchema = z.object({
  drivers: z.array(z.string()).describe('Key phrases and words driving the sentiment.'),
});
export type ExtractKeySentimentDriversOutput = z.infer<typeof ExtractKeySentimentDriversOutputSchema>;

export async function extractKeySentimentDrivers(input: ExtractKeySentimentDriversInput): Promise<ExtractKeySentimentDriversOutput> {
  return extractKeySentimentDriversFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractKeySentimentDriversPrompt',
  input: {schema: ExtractKeySentimentDriversInputSchema},
  output: {schema: ExtractKeySentimentDriversOutputSchema},
  prompt: `Identify the key phrases and words in the following text that drive its {{{sentiment}}} sentiment. Return these phrases and words as a list.

Text: {{{text}}}`,
});

const extractKeySentimentDriversFlow = ai.defineFlow(
  {
    name: 'extractKeySentimentDriversFlow',
    inputSchema: ExtractKeySentimentDriversInputSchema,
    outputSchema: ExtractKeySentimentDriversOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
