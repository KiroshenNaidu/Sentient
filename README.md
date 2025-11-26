# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

# Sentient

Sentient is a lightweight AI-powered sentiment analysis tool built in TypeScript. It uses the Gemini API to classify messages as **positive**, **negative**, or **neutral**, and provides a confidence rating along with explanation and drivers for each analysis.  

---

## Features

- **Single and Multiple Message Analysis**: Analyze one message at a time or in batches.  
- **Confidence Scoring**: Each prediction includes a confidence score.  
- **Insightful Drivers & Explanation**: Provides reasons behind the sentiment classification.  
- **High TypeScript Coverage**: 98% of the codebase uses TypeScript for type safety.  
- **Lightweight & Fast**: Minimal dependencies and optimized for performance.  

---

## Installation

```bash
git clone <repository-url>
cd sentient
npm install

Usage

Import the analysis functions and use them in your project:

import { analyzeSingleText, analyzeMultipleTexts } from './path-to-your-file';

// Analyze a single message
const singleResult = await analyzeSingleText("I really enjoy using this app.");
console.log(singleResult);
// Example output:
// {
//   sentiment: "positive",
//   confidence: 0.92,
//   drivers: ["enjoy", "positive context"],
//   explanation: "The message expresses satisfaction and positive emotion."
// }

// Analyze multiple messages
const multipleResults = await analyzeMultipleTexts([
  "I love this!",
  "This is terrible.",
  "It's okay."
]);
console.log(multipleResults);
// Example output:
// [
//   { sentiment: "positive", confidence: 0.95, drivers: ["love"], explanation: "Expresses strong positive emotion." },
//   { sentiment: "negative", confidence: 0.88, drivers: ["terrible"], explanation: "Expresses negative sentiment." },
//   { sentiment: "neutral", confidence: 0.80, drivers: [], explanation: "Message is neutral or balanced." }
// ]
Requirements

Node.js >= 18

Gemini API key configured in your environment

Make sure your Gemini API key is properly set up to allow the app to analyze sentiment.

Contributing

Contributions are welcome. You can:

Submit bug reports or feature requests via GitHub issues.

Submit pull requests for bug fixes or improvements.

Please ensure TypeScript type safety is maintained.
