'use client';

import type { AnalysisResult } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
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
  const sentimentCounts = {
    positive: results.filter((r) => r.sentiment === 'positive').length,
    negative: results.filter((r) => r.sentiment === 'negative').length,
    neutral: results.filter((r) => r.sentiment === 'neutral').length,
  };

  const chartData = [
    {
      name: 'Positive',
      count: sentimentCounts.positive,
      fill: 'var(--color-positive)',
    },
    {
      name: 'Negative',
      count: sentimentCounts.negative,
      fill: 'var(--color-negative)',
    },
    {
      name: 'Neutral',
      count: sentimentCounts.neutral,
      fill: 'var(--color-neutral)',
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
            <BarChart accessibilityLayer data={chartData} layout="horizontal" margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" radius={8} barSize={60}>
                 <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
