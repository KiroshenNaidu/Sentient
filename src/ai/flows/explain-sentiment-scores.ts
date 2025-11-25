'use server';

/**
 * @fileOverview A flow to explain sentiment scores by highlighting key portions of the text.
 *
 * - explainSentimentScores - A function that takes text and keywords and returns an explanation of the sentiment score.
 * - ExplainSentimentScoresInput - The input type for the explainSentimentScores function.
 * - ExplainSentimentScoresOutput - The return type for the explainSentimentScores function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSentimentScoresInputSchema = z.object({
  text: z.string().describe('The text to explain the sentiment score for.'),
  keywords: z.array(z.string()).describe('The keywords that drive the sentiment.'),
});
export type ExplainSentimentScoresInput = z.infer<typeof ExplainSentimentScoresInputSchema>;

const ExplainSentimentScoresOutputSchema = z.object({
  explanation: z.string().describe('The explanation of why the text received the sentiment score, highlighting key portions of the text.'),
});
export type ExplainSentimentScoresOutput = z.infer<typeof ExplainSentimentScoresOutputSchema>;

export async function explainSentimentScores(input: ExplainSentimentScoresInput): Promise<ExplainSentimentScoresOutput> {
  return explainSentimentScoresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSentimentScoresPrompt',
  input: {schema: ExplainSentimentScoresInputSchema},
  output: {schema: ExplainSentimentScoresOutputSchema},
  prompt: `You are an expert sentiment analyst. You are explaining the sentiment score of a given text.

  The text is:
  {{text}}

  The keywords that drive the sentiment are:
  {{#each keywords}}
  - {{this}}
  {{/each}}

  Explain why the text received the sentiment score, highlighting key portions of the text that contribute to the sentiment.
  Be concise and to the point.
  `,
});

const explainSentimentScoresFlow = ai.defineFlow(
  {
    name: 'explainSentimentScoresFlow',
    inputSchema: ExplainSentimentScoresInputSchema,
    outputSchema: ExplainSentimentScoresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
