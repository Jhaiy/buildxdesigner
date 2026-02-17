# Gemini AI Integration Setup

This guide explains how to integrate Google's Gemini 2.5 Flash API for enhanced UI generation in CodeCraft.

## Overview

CodeCraft now features a powerful "Make" tab in the Dashboard that uses Google's Gemini 2.5 Flash API to generate complete website UIs from natural language descriptions. The system intelligently analyzes your prompts and creates professional, production-ready components.

## Quick Start

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API key" or "Create API key"
4. Copy your API key securely

### 2. Configure the Application

In `/components/Dashboard.tsx`, locate this line (around line 297):

\`\`\`typescript
const apiKey = 'AIzaSyBL83g3OfpvDqM95YwEtKJ3w5y9aN6LzUw'; // Replace with your actual API key
\`\`\`

Replace it with your actual API key:

\`\`\`typescript
const apiKey = 'YOUR_ACTUAL_GEMINI_API_KEY_HERE';
\`\`\`

### 3. Test the Integration

1. Open CodeCraft Dashboard
2. Click the "Make" tab in the top navigation
3. Enter a prompt like: "Create a modern landing page for a SaaS product with hero section, features, and pricing"
4. Click "Generate UI"
5. Watch as Gemini creates your website in real-time!

## Features

### CodeCraft Make - UI Generator

The "Make" tab provides:

- **Natural Language Input:** Describe your website in plain English
- **Real-time Progress:** Visual progress bar showing generation status
- **Instant Preview:** Generated UI loads directly into the editor
- **Smart Templates:** Click recommended templates for quick project creation
- **Theme Support:** Full light/dark/system theme integration

### How It Works

1. **User Input:** You describe the website you want to create
2. **AI Processing:** Gemini 2.5 Flash analyzes your description
3. **Component Generation:** AI creates a structured JSON of components
4. **Validation:** System validates and ensures proper formatting
5. **Rendering:** Components are loaded into the visual editor

## API Configuration

### Current Model

\`\`\`typescript
Model: gemini-2.0-flash-exp
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
\`\`\`

### Generation Parameters

\`\`\`typescript
{
  temperature: 0.7,      // Creativity level (0-1)
  maxOutputTokens: 2048  // Maximum response length
}
\`\`\`

## Prompt Engineering

The system uses an optimized prompt that instructs Gemini to:

1. Generate valid JSON component structures
2. Use appropriate component types (navbar, hero, features, cta, footer, etc.)
3. Include professional styling and colors
4. Create responsive layouts
5. Generate relevant placeholder content

Example optimized prompt:

\`\`\`
You are a professional web designer. Generate a complete website structure based on this description: "Create a portfolio website for a photographer"

Return ONLY a valid JSON array of component objects with this structure:
{
  "id": "unique-id",
  "type": "navbar | hero | features | cta | footer | text | button | image | card",
  "props": {
    "text": "content",
    "heading": "heading text",
    ...
  },
  "style": {
    "backgroundColor": "#hex",
    "color": "#hex",
    ...
  }
}
\`\`\`
