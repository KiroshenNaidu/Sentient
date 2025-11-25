export type Sentiment = 'positive' | 'negative' | 'neutral';

export type AnalysisResult = {
  id: string;
  text: string;
  sentiment: Sentiment;
  confidence: number;
  drivers: string[];
  explanation: string;
};
