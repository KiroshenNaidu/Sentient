'use client';

import { useState, useTransition, type DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileCheck } from 'lucide-react';

type TextInputSectionProps = {
  onAnalyze: (texts: string[]) => void;
  isProcessing: boolean;
};

export function TextInputSection({ onAnalyze, isProcessing }: TextInputSectionProps) {
  const [text, setText] = useState('');
  const [fileTexts, setFileTexts] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [isReadingFile, startFileReadTransition] = useTransition();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { toast } = useToast();

  const processFile = (file: File) => {
    setFileName(file.name);
    setText(''); 
    setFileTexts([]);
    
    startFileReadTransition(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          let texts: string[] = [];
          if (file.type === 'application/json') {
            const jsonData = JSON.parse(content);
            if (Array.isArray(jsonData)) {
              texts = jsonData.map(item => typeof item === 'string' ? item : item.text).filter(Boolean);
            } else {
               throw new Error('JSON file must contain an array of strings or objects with a "text" property.');
            }
          } else if (file.type === 'text/csv') {
            const rows = content.split('\n').slice(1); // Skip header
            texts = rows.map(row => row.split(',')[0]).filter(Boolean);
          } else { // txt file
            texts = content.split('\n').filter(Boolean);
          }
          setFileTexts(texts);
        } catch(error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          toast({ variant: 'destructive', title: 'File Read Error', description: `Could not parse ${file.name}: ${message}` });
          setFileName('');
          setFileTexts([]);
        }
      };
      reader.onerror = () => {
        toast({ variant: 'destructive', title: 'File Read Error', description: `Could not read the file ${file.name}.` });
        setFileName('');
        setFileTexts([]);
      };
      reader.readAsText(file);
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    event.target.value = ''; // Allow re-uploading the same file
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
    if(isLoading) return;

    const file = event.dataTransfer.files?.[0];
     if (file && ['.txt', '.csv', '.json'].some(ext => file.name.endsWith(ext))) {
      processFile(file);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please drop a .txt, .csv, or .json file.',
      });
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if(!isLoading) setIsDraggingOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
  };
  
  const handleSubmit = () => {
    if (fileTexts.length > 0) {
      onAnalyze(fileTexts);
    } else {
      onAnalyze([text]);
    }
  };

  const isLoading = isProcessing || isReadingFile;
  const canAnalyze = (text.trim() !== '' || fileTexts.length > 0) && !isLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Sentiment</CardTitle>
        <CardDescription>Enter text directly, or upload a file to get started.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Textarea
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if(fileName) {
                setFileName('');
                setFileTexts([]);
              }
            }}
            className="min-h-[200px] resize-y"
            disabled={isLoading}
          />
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <div className="space-y-4">
          <Label 
            htmlFor="file-upload" 
            className={!isLoading ? "cursor-pointer" : "cursor-not-allowed"}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <div 
              className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors data-[disabled=true]:hover:border-dashed data-[disabled=true]:opacity-50 ${isDraggingOver ? 'border-primary bg-accent' : 'hover:border-primary'}`}
              data-disabled={isLoading}
            >
              <div className="text-center">
                {isReadingFile ? (
                  <>
                    <Loader2 className="mx-auto h-8 w-8 text-muted-foreground animate-spin" />
                    <p className="mt-2 text-sm text-muted-foreground">Reading {fileName}...</p>
                  </>
                ) : fileName && fileTexts.length > 0 ? (
                    <>
                        <FileCheck className="mx-auto h-8 w-8 text-green-500" />
                        <p className="mt-2 text-sm font-medium text-foreground">{fileName}</p>
                        <p className="text-xs text-muted-foreground">{fileTexts.length} entr{fileTexts.length > 1 ? 'ies' : 'y'} loaded</p>
                    </>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">{isDraggingOver ? 'Drop the file here' : 'Click or drag & drop'}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">.txt, .csv, or .json</p>
                  </>
                )}
              </div>
            </div>
          </Label>
          <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".txt,.csv,.json" disabled={isLoading}/>
          <Button onClick={handleSubmit} className="w-full text-primary-foreground disabled:text-primary-foreground/70 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] enabled:hover:animate-gradient-loop" disabled={!canAnalyze}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
