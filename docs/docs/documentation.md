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

More detail on each of these points is provided below.

## 3. Implementation Challenges

_(To be completed.)_

## 4. User Guide

_(To be completed.)_
