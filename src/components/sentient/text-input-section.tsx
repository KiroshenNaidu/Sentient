'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

type TextInputSectionProps = {
  onAnalyze: (texts: string[]) => void;
  isProcessing: boolean;
};

export function TextInputSection({ onAnalyze, isProcessing }: TextInputSectionProps) {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isReadingFile, startFileReadTransition] = useTransition();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setText(''); // Clear textarea when a file is selected
      
      startFileReadTransition(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          try {
            if (file.type === 'application/json') {
              const jsonData = JSON.parse(content);
              if (Array.isArray(jsonData)) {
                const texts = jsonData.map(item => typeof item === 'string' ? item : item.text).filter(Boolean);
                onAnalyze(texts);
              } else {
                 throw new Error('JSON file must contain an array of strings or objects with a "text" property.');
              }
            } else if (file.type === 'text/csv') {
              const rows = content.split('\n').slice(1); // Skip header
              const texts = rows.map(row => row.split(',')[0]).filter(Boolean);
              onAnalyze(texts);
            } else { // txt file
              onAnalyze([content]);
            }
          } catch(error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast({ variant: 'destructive', title: 'File Read Error', description: `Could not parse ${file.name}: ${message}` });
            setFileName('');
          }
        };
        reader.onerror = () => {
          toast({ variant: 'destructive', title: 'File Read Error', description: `Could not read the file ${file.name}.` });
          setFileName('');
        };
        reader.readAsText(file);
      });
    }
    event.target.value = ''; // Allow re-uploading the same file
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze([text]);
    } else {
      toast({ variant: 'destructive', title: 'Input Error', description: 'Please enter some text to analyze.' });
    }
  };

  const isLoading = isProcessing || isReadingFile;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Sentiment</CardTitle>
        <CardDescription>Enter text directly, or upload a file to get started.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if(fileName) setFileName('');
            }}
            className="min-h-[200px] resize-y"
            disabled={isLoading || !!fileName}
          />
          <Button type="submit" className="w-full" disabled={isLoading || !text.trim()}>
            {isLoading && !fileName ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze Text
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <div>
          <Label htmlFor="file-upload" className={!isLoading ? "cursor-pointer" : "cursor-not-allowed"}>
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:border-primary transition-colors data-[disabled=true]:hover:border-dashed data-[disabled=true]:opacity-50" data-disabled={isLoading}>
              <div className="text-center">
                {isLoading && fileName ? (
                  <>
                    <Loader2 className="mx-auto h-8 w-8 text-muted-foreground animate-spin" />
                    <p className="mt-2 text-sm text-muted-foreground">Processing {fileName}...</p>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Click to upload a file</span>
                    </p>
                    <p className="text-xs text-muted-foreground">.txt, .csv, or .json</p>
                    {fileName && !isLoading && <p className="text-xs text-accent-foreground mt-1">{fileName} ready. Submit above.</p>}
                  </>
                )}
              </div>
            </div>
          </Label>
          <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".txt,.csv,.json" disabled={isLoading}/>
        </div>
      </CardContent>
    </Card>
  );
}
