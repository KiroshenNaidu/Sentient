'use client';

import type { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Smile, Frown, Meh, Percent, FileText, ListTree } from 'lucide-react';

const sentimentConfig = {
  positive: {
    label: 'Positive',
    Icon: Smile,
    colorClass: 'text-[hsl(var(--chart-2))]',
    bgClass: 'bg-[hsl(var(--chart-2)/0.1)]',
  },
  negative: {
    label: 'Negative',
    Icon: Frown,
    colorClass: 'text-[hsl(var(--chart-1))]',
    bgClass: 'bg-[hsl(var(--chart-1)/0.1)]',
  },
  neutral: {
    label: 'Neutral',
    Icon: Meh,
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-muted',
  },
};

type ResultsDisplayProps = {
  result: AnalysisResult;
};

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const config = sentimentConfig[result.sentiment];

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${config.bgClass} flex flex-row items-center justify-between space-y-0`}>
        <div className="flex items-center gap-3">
          <config.Icon className={`h-8 w-8 ${config.colorClass}`} />
          <CardTitle className={`text-2xl ${config.colorClass}`}>
            {config.label}
          </CardTitle>
        </div>
        <Badge variant="secondary" className="text-lg">{(result.confidence * 100).toFixed(0)}%</Badge>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
             <Percent className="h-4 w-4" />
             <span>Confidence Score</span>
          </div>
          <Progress value={result.confidence * 100} />
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
