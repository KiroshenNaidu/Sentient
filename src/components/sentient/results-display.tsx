'use client';

import type { AnalysisResult, Sentiment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Smile, Frown, Meh, FileText, ListTree } from 'lucide-react';

const sentimentConfig = {
  positive: {
    label: 'Positive',
    Icon: Smile,
    colorClass: 'text-[hsl(var(--chart-2))]',
    progressColorClass: 'bg-[hsl(var(--chart-2))]',
  },
  negative: {
    label: 'Negative',
    Icon: Frown,
    colorClass: 'text-[hsl(var(--chart-1))]',
    progressColorClass: 'bg-[hsl(var(--chart-1))]',
  },
  neutral: {
    label: 'Neutral',
    Icon: Meh,
    colorClass: 'text-muted-foreground',
    progressColorClass: 'bg-muted-foreground',
  },
};

type ResultsDisplayProps = {
  result: AnalysisResult;
};

function SentimentBar({ sentiment, value }: { sentiment: Sentiment; value: number }) {
  const config = sentimentConfig[sentiment];
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className={`flex items-center gap-2 font-medium ${config.colorClass}`}>
          <config.Icon className="h-5 w-5" />
          <span>{config.label}</span>
        </div>
        <span className="font-mono text-muted-foreground">{value.toFixed(0)}%</span>
      </div>
      <Progress value={value} indicatorClassName={config.progressColorClass} />
    </div>
  );
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const mainSentiment = result.sentiment;
  const mainConfidence = result.confidence * 100;

  let scores: Record<Sentiment, number> = {
    positive: 0,
    negative: 0,
    neutral: 0,
  };
  scores[mainSentiment] = mainConfidence;
  
  const remainingConfidence = 100 - mainConfidence;
  const otherSentiments = (['positive', 'negative', 'neutral'] as Sentiment[]).filter(s => s !== mainSentiment);

  if (otherSentiments.length > 0) {
    // A more robust way to distribute the remainder
    if (result.sentiment === 'positive') {
        scores.negative = remainingConfidence * 0.75;
        scores.neutral = remainingConfidence * 0.25;
    } else if (result.sentiment === 'negative') {
        scores.positive = remainingConfidence * 0.25;
        scores.neutral = remainingConfidence * 0.75;
    } else { // neutral
        scores.positive = remainingConfidence * 0.5;
        scores.negative = remainingConfidence * 0.5;
    }
  }

  // Final check to ensure it all adds up to exactly 100, handling any minor floating point issues.
  const totalScore = scores.positive + scores.negative + scores.neutral;
  if (totalScore > 0) {
    scores.positive = (scores.positive / totalScore) * 100;
    scores.negative = (scores.negative / totalScore) * 100;
    scores.neutral = (scores.neutral / totalScore) * 100;
  }
  
  const mainConfig = sentimentConfig[result.sentiment];

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${mainConfig.bgClass} flex flex-row items-center justify-between space-y-0`}>
        <div className="flex items-center gap-3">
          <mainConfig.Icon className={`h-8 w-8 ${mainConfig.colorClass}`} />
          <CardTitle className={`text-2xl ${mainConfig.colorClass}`}>
            Overall: {mainConfig.label}
          </CardTitle>
        </div>
        <Badge variant="secondary" className="text-lg">{(result.confidence * 100).toFixed(0)}% Certain</Badge>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Sentiment Breakdown</h4>
          <SentimentBar sentiment="positive" value={Math.round(scores.positive)} />
          <SentimentBar sentiment="negative" value={Math.round(scores.negative)} />
          <SentimentBar sentiment="neutral" value={Math.round(scores.neutral)} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ListTree className="h-4 w-4" />
            <span>Sentiment Drivers</span>
          </div>
          {result.drivers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.drivers.map((driver, index) => (
                <Badge key={index} variant="secondary">{driver}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No specific drivers identified.</p>
          )}
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="explanation">
            <AccordionTrigger>
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                <span>AI Explanation</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>{result.explanation}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
