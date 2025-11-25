import { Header } from '@/components/sentient/header';
import { SentimentAnalysisDashboard } from '@/components/sentient/sentiment-analysis-dashboard';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SentimentAnalysisDashboard />
    </div>
  );
}
