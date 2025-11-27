# Sentient  
Lightweight AI-Powered Sentiment Analysis Tool

Sentient is a web application built with Next.js and TypeScript for classifying text messages as positive, negative, or neutral. Each analysis returns a confidence score, drivers, and an explanation.

---

## Features

- Single-message sentiment analysis  
- Batch sentiment analysis (multiple messages)  
- Confidence scoring for each classification  
- Explanation and drivers for classifications  
- Fully typed with TypeScript  
- Lightweight and easy to integrate  

---

## Technology Stack

- Next.js  
- TypeScript  
- Tailwind CSS / PostCSS  
- Node.js  
- API integration (e.g., Gemini API for sentiment classification)  

---

## Repository Structure

/public # Static assets
/src # Application source code
/docs # Optional documentation
package.json # Dependencies and scripts
next.config.ts # Next.js configuration
tailwind.config.ts # Tailwind CSS configuration
tsconfig.json # TypeScript configuration
apphosting.yaml # Hosting configuration (if applicable)
.gitignore # Ignored files
.env # Environment variables (not committed)
README.md # Documentation and setup instructions


---

## Getting Started

1. **Clone the repository**  

git clone https://github.com/KiroshenNaidu/Sentient.git
cd Sentient

2. **Install dependencies**

npm install

3. **Configure environment variables**

Create a .env.local (or .env) file:
GEMINI_API_KEY=your_api_key_here

4. **Run the development server**

npm run dev

Visit http://localhost:3000 in your browser.


# Build & Deployment

1. **Build the application for production:**

npm run build


2. **Deploy to your hosting platform (e.g., Firebase Hosting, Vercel, Netlify).**

# Usage as a Module

You can also use Sentient programmatically:

import { analyzeSingleText, analyzeMultipleTexts } from './src/your-analysis-file';

const result = await analyzeSingleText("I really enjoy using this tool.");
console.log(result);
// Example output: { sentiment: "positive", confidence: 0.92, drivers: ["enjoy"], explanation: "The message expresses positive emotion." }

const results = await analyzeMultipleTexts([
  "I love this!",
  "This is terrible.",
  "It's okay."
]);
console.log(results);

Ensure Node.js version >= 18 and the API key is properly configured.


# Contributing

To contribute:

1. **Fork the repository**

2. **Create a new branch:**

git checkout -b feature/your-feature

3. **Make your changes (keep TypeScript type safety)**

4. **Submit a pull request with a clear description of your changes**

You can also open issues for bugs, suggestions, or improvements.

