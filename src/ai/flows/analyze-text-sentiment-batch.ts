'use server';

/**
 * @fileOverview Performs sentiment analysis on a batch of text inputs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeTextSentimentBatchInputSchema = z.object({
  texts: z.array(z.string()).describe('The texts to analyze for sentiment.'),
});
export type AnalyzeTextSentimentBatchInput = z.infer<typeof AnalyzeTextSentimentBatchInputSchema>;

const SingleAnalysisResultSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('The sentiment of the text.'),
  confidence: z.number().min(0).max(1).describe('The confidence score of the sentiment analysis.'),
  drivers: z.array(z.string()).describe('Key phrases and words driving the sentiment.'),
  explanation: z.string().describe('An explanation of the sentiment analysis.'),
  original_index: z.number().describe('The original index of the text in the input array.'),
});

const AnalyzeTextSentimentBatchOutputSchema = z.object({
  results: z.array(SingleAnalysisResultSchema),
});
export type AnalyzeTextSentimentBatchOutput = z.infer<typeof AnalyzeTextSentimentBatchOutputSchema>;

export async function analyzeTextSentimentBatch(input: AnalyzeTextSentimentBatchInput): Promise<z.infer<typeof SingleAnalysisResultSchema>[]> {
    const result = await analyzeTextSentimentBatchFlow(input);
    // Sort the results back to their original order
    return result.results.sort((a, b) => a.original_index - b.original_index);
}

const batchAnalysisPrompt = ai.definePrompt({
  name: 'analyzeTextSentimentBatchPrompt',
  input: { schema: AnalyzeTextSentimentBatchInputSchema },
  output: { schema: AnalyzeTextSentimentBatchOutputSchema },
  prompt: `You are a sentiment analysis expert. For each text provided in the input array, perform a comprehensive sentiment analysis.

Your analysis for each text must include:
1.  **Sentiment**: Classify as 'positive', 'negative', or 'neutral'.
2.  **Confidence**: A score from 0 to 1 indicating your certainty.
3.  **Drivers**: A list of key words or phrases that most influenced the sentiment classification.
4.  **Explanation**: A brief, clear explanation of why the text received its sentiment score, referencing the drivers.
5.  **Original Index**: The original index of the text from the input array.

Analyze the following texts:
{{#each texts}}
---
TEXT_{{{@index}}}: "{{this}}"
---
{{/each}}

Respond with a single JSON object containing a "results" array. Each object in the array must conform to the specified output schema.
`,
});

const analyzeTextSentimentBatchFlow = ai.defineFlow(
  {
    name: 'analyzeTextSentimentBatchFlow',
    inputSchema: AnalyzeTextSentimentBatchInputSchema,
    outputSchema: AnalyzeTextSentimentBatchOutputSchema,
  },
  async (input) => {
    const { output } = await batchAnalysisPrompt(input);
    return output!;
  }
);
