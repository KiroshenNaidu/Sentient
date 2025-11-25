'use client';

import type { AnalysisResult } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  positive: {
    label: 'Positive',
    color: 'hsl(var(--chart-2))',
  },
  negative: {
    label: 'Negative',
    color: 'hsl(var(--chart-1))',
  },
  neutral: {
    label: 'Neutral',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

type SentimentDistributionChartProps = {
  results: AnalysisResult[];
};

export function SentimentDistributionChart({ results }: SentimentDistributionChartProps) {
  const data = [
    {
      name: 'Sentiments',
      positive: results.filter((r) => r.sentiment === 'positive').length,
      negative: results.filter((r) => r.sentiment === 'negative').length,
      neutral: results.filter((r) => r.sentiment === 'neutral').length,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Distribution</CardTitle>
        <CardDescription>Comparative analysis of sentiment across all entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide
              />
              <XAxis dataKey="positive" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="positive" fill="var(--color-positive)" radius={5} name="Positive" />
              <Bar dataKey="negative" fill="var(--color-negative)" radius={5} name="Negative" />
              <Bar dataKey="neutral" fill="var(--color-neutral)" radius={5} name="Neutral" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
