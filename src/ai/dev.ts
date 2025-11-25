import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-text-sentiment.ts';
import '@/ai/flows/extract-key-sentiment-drivers.ts';
import '@/ai/flows/explain-sentiment-scores.ts';