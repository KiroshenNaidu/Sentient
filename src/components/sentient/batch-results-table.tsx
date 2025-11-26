'use client';

import type { AnalysisResult } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Smile, Frown, Meh } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const sentimentConfig = {
  positive: {
    Icon: Smile,
    colorClass: 'text-[hsl(var(--chart-2))]',
  },
  negative: {
    Icon: Frown,
    colorClass: 'text-[hsl(var(--chart-1))]',
  },
  neutral: {
    Icon: Meh,
    colorClass: 'text-muted-foreground',
  },
};

type BatchResultsTableProps = {
  results: AnalysisResult[];
};

export function BatchResultsTable({ results }: BatchResultsTableProps) {
  const exportToJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sentiment_analysis_results.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToCSV = () => {
    const headers = ['id', 'text', 'sentiment', 'confidence', 'drivers', 'explanation'];
    const csvRows = [headers.join(',')];
    results.forEach(res => {
      const values = headers.map(header => {
        const key = header as keyof AnalysisResult;
        let value = res[key];
        if (Array.isArray(value)) {
          value = value.join('; ');
        }
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sentiment_analysis_results.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToTXT = () => {
    let textContent = `Sentiment Analysis Results\n\n`;
    results.forEach(res => {
        textContent += `--------------------------------------------------\n`;
        textContent += `ID: ${res.id}\n`;
        textContent += `Text: ${res.text}\n`;
        textContent += `Sentiment: ${res.sentiment}\n`;
        textContent += `Confidence: ${(res.confidence * 100).toFixed(0)}%\n`;
        textContent += `Drivers: ${res.drivers.join(', ')}\n`;
        textContent += `Explanation: ${res.explanation}\n`;
        textContent += `--------------------------------------------------\n\n`;
    });
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sentiment_analysis_results.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Sentiment Analysis Results", 14, 16);
    
    const tableData = results.map(res => [
        res.sentiment,
        `${(res.confidence * 100).toFixed(0)}%`,
        res.text,
        res.drivers.join(', '),
        res.explanation,
    ]);

    (doc as any).autoTable({
        head: [['Sentiment', 'Confidence', 'Text', 'Drivers', 'Explanation']],
        body: tableData,
        startY: 22,
        styles: {
            fontSize: 8,
        },
        headStyles: {
            fillColor: [38, 50, 56]
        },
        columnStyles: {
            2: { cellWidth: 60 },
            4: { cellWidth: 40 }
        }
    });

    doc.save('sentiment_analysis_results.pdf');
  };

  return (
    <div className="space-y-4">
       <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={exportToJSON}>Export as JSON</DropdownMenuItem>
            <DropdownMenuItem onClick={exportToCSV}>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={exportToTXT}>Export as TXT</DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF}>Export as PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Sentiment</TableHead>
              <TableHead className="w-[120px]">Confidence</TableHead>
              <TableHead>Text Sample</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => {
              const config = sentimentConfig[result.sentiment];
              return (
                <Accordion type="single" collapsible asChild key={result.id}>
                  <TableRow>
                    <TableCell>
                      <div className={`flex items-center gap-2 font-medium ${config.colorClass}`}>
                        <config.Icon className="h-5 w-5" />
                        <span>{result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{`${(result.confidence * 100).toFixed(0)}%`}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{result.text}</TableCell>
                    <TableCell>
                        <AccordionItem value={result.id} className="border-b-0">
                           <AccordionTrigger className="p-2 hover:no-underline [&[data-state=open]>svg]:rotate-90" />
                            <AccordionContent asChild>
                               <tr className="bg-muted hover:bg-muted">
                                    <td colSpan={4} className="p-0">
                                        <div className="p-6 space-y-4">
                                            <div>
                                                <h4 className="font-semibold mb-2">Full Text</h4>
                                                <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-md">{result.text}</p>
                                            </div>
                                             <div>
                                                <h4 className="font-semibold mb-2">Sentiment Drivers</h4>
                                                {result.drivers.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {result.drivers.map((driver, index) => (
                                                    <Badge key={index} variant="outline">{driver}</Badge>
                                                    ))}
                                                </div>
                                                ) : (
                                                <p className="text-sm text-muted-foreground">No specific drivers identified.</p>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">AI Explanation</h4>
                                                <p className="text-sm text-muted-foreground">{result.explanation}</p>
                                            </div>
                                        </div>
                                    </td>
                               </tr>
                            </AccordionContent>
                        </AccordionItem>
                    </TableCell>
                  </TableRow>
                </Accordion>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
