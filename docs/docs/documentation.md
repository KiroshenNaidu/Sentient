# Sentient – Project Documentation
 
> Focus: API selection justification, implementation challenges, and user guide.

---

## 1. Overview

Sentient is a web application that performs sentiment analysis on user-provided text and documents.  
The system uses Firebase as the backend platform and Google’s Gemini model as the core NLP engine.  
Users can submit text, `.txt` files, and `.pdf` files, and the app returns:

- Overall sentiment (positive / neutral / negative)
- A confidence score
- Important keywords or phrases
- A short explanation of why the text was classified that way

This documentation focuses on three aspects:
1. Why Gemini was selected as the primary API  
2. The main implementation challenges we encountered  
3. A user-oriented guide with practical examples


## 2. API Selection Justification

We evaluated several possible NLP options before choosing between:
- Google Gemini API
- Hugging Face Inference API
- AWS Comprehend
- Azure Text Analytics

Our final choice was **Google Gemini**, mainly because:
- It integrates smoothly with Firebase.
- It supports multiple tasks through prompting (sentiment, explanation, keywords).
- It offers a generous free tier suitable for a student project.


### Reasons for choosing Google Gemini. **Tight integration with Firebase**  
Gemini can be called directly from Firebase Functions and works well with Firestore triggers. This reduced the amount of backend code we had to write and made the pipeline simpler.

**Multi-tasking via a single prompt**  
   With one carefully designed prompt, Gemini can:
   - classify sentiment,
   - produce a confidence-style score,
   - extract keywords, and
   - generate a short explanation.  
Other APIs would require multiple separate models or endpoints.

**Cost and free-tier suitability**  
As students, we needed a free solution. Gemini’s free tier plus the Firebase Spark plan allowed us to build and test the app without any paid services.

**Good language understanding**  
Gemini handles informal text, mixed sentiment, and longer reviews better than some simpler “rule-based” APIs. 

### Alternatives considered
**Hugging Face Inference API**
- Pros: many specialised models, strong open-source community.
- Cons: we would have needed separate models for sentiment and keyphrase extraction, plus custom hosting or a separate backend.
  
**AWS Comprehend / Azure Text Analytics**
- Pros: production-grade services with dashboards.
- Cons: more complex to set up for a small student project, and harder to integrate directly with our existing Firebase-based frontend.

Because of these trade-offs, Gemini gave us the best balance of:
- ease of integration,
- flexibility through prompting, and
- low cost.

## 3. Implementation Challenges

During development we ran into several practical issues:
- Deploying the app while keeping environment variables (API keys) secure
- Getting consistent JSON-style output back from Gemini
- Handling file uploads (especially `.pdf`) and extracting text
- Token limits for very long documents

### 3.1 Secure handling of API keys
We had to make sure the `GEMINI_API_KEY` was never exposed in the frontend or committed to GitHub. The solution was to keep the key in environment variables and access it only from server-side code (Firebase Functions / Next.js API routes). This added some setup complexity but is important for security.

### 3.2 Consistent output format from Gemini
Early prompts returned free-form text that was hard to parse. We refined the prompt to ask Gemini to respond in a strict JSON structure containing:
- `sentiment` - `confidence` - `keywords` - `explanation`
This made it easier for the UI to display results reliably.


## 4. User Guide

This section explains how an end user can interact with the deployed application.
### 4.1 Accessing the app
The app is currently deployed at:
- **Production URL:** https://sentien.netlify.app/
### 4.2 Basic workflow
1. Open the website in a browser.
2. Choose whether to paste text or upload a file or write the text yourself.
3. Click the button to run the analysis.
4. View the sentiment, confidence, keywords, and explanation returned by the model.
