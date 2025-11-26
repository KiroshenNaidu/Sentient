'use client';

import { useState, useTransition, useEffect } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { analyzeSingleText, analyzeMultipleTexts } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TextInputSection } from './text-input-section';
import { ResultsDisplay } from './results-display';
import { BatchResultsTable } from './batch-results-table';
import { SentimentDistributionChart } from './sentiment-distribution-chart';
import { BarChart2 } from 'lucide-react';

export function SentimentAnalysisDashboard() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isProcessing, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('single');
  const { toast } = useToast();

  const handleAnalyze = (texts: string[]) => {
    if (texts.length === 0 || texts.every(t => !t.trim())) {
      toast({ variant: 'destructive', title: 'Input Error', description: 'No text to analyze.' });
      return;
    }

    setResults([]);
    
    startTransition(async () => {
      try {
        let newResults: AnalysisResult[] = [];
        if (texts.length === 1) {
          const analysisData = await analyzeSingleText(texts[0]);
          newResults = [
            {
              id: `${Date.now()}-0`,
              text: texts[0],
              ...analysisData,
            },
          ];
          setActiveTab('single');
        } else {
          const analysisData = await analyzeMultipleTexts(texts);
          newResults = analysisData.map((data, index) => ({
            id: `${Date.now()}-${index}`,
            text: texts[index],
            ...data,
          }));
          setActiveTab('batch');
        }
        setResults(newResults);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ variant: 'destructive', title: 'Analysis Failed', description: message });
      }
    });
  };

  const singleResult = results.length > 0 ? results[0] : null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="sticky top-24">
          <TextInputSection onAnalyze={handleAnalyze} isProcessing={isProcessing} />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" disabled={results.length > 1}>Single Analysis</TabsTrigger>
            <TabsTrigger value="batch" disabled={results.length > 0 && results.length <= 1}>Batch Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            {isProcessing ? (
               <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-12 w-1/3" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-4/5" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ) : singleResult ? (
              <ResultsDisplay result={singleResult} />
            ) : (
              <EmptyState />
            )}
          </TabsContent>
          <TabsContent value="batch" className="space-y-4">
             {isProcessing ? (
              <div className="space-y-4">
                <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
                <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
              </div>
            ) : results.length > 1 ? (
              <>
                <SentimentDistributionChart results={results} />
                <BatchResultsTable results={results} />
              </>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}


function EmptyState() {
    return (
        <Card className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-8">
                <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No results to display</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Enter some text or upload a file to start the analysis.
                </p>
            </div>
        </Card>
    );
}
