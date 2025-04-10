# VoiceEase: Voice Stress Analysis Chatbot

VoiceEase is a comprehensive web application designed to analyze stress levels through voice input and provide personalized stress management recommendations. It features a conversational chatbot for mental wellness support, real-time voice stress detection, and detailed stress history tracking and visualization.

![VoiceEase Logo](/client/public/logo.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [API Integration](#api-integration)
- [Stress Analysis Metrics](#stress-analysis-metrics)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

VoiceEase is built to help users monitor and manage their stress levels through voice analysis. The application integrates advanced speech processing technologies with a user-friendly interface, allowing users to:

- Record their voice for real-time stress analysis
- Receive personalized stress management recommendations
- Track their stress levels over time
- Chat with an AI-powered mental wellness assistant

This tool serves as a personal stress management companion, providing immediate feedback on stress indicators detected in users' voice patterns.

## 🔧 Features

### 1. Voice-Based Stress Detection

- **Voice Recording**: Record your voice directly from the browser
- **Multi-factor Analysis**: Analyze voice for multiple stress indicators:
  - Speech pace (words per minute)
  - Voice tone patterns
  - Voice tremor detection
  - Sentiment analysis of spoken content
- **Real-time Results**: Get immediate feedback on your stress levels
- **Visual Indicators**: Clear stress level displays from Low to High

### 2. Conversational Wellness Chatbot

- **Google Gemini-powered**: AI-driven conversational assistance
- **Mental Wellness Focus**: Specialized in stress management topics
- **Contextual Responses**: Provides relevant advice based on detected stress levels
- **Interactive Experience**: Natural conversation flow with typing indicators

### 3. Stress History & Visualization

- **Historical Tracking**: View your stress level changes over time
- **Interactive Charts**: Visualize trends with Recharts integration
- **Detailed Breakdown**: Access comprehensive analysis of past recordings
- **Time Range Filtering**: Filter history by day, week, or month

### 4. Personalized Recommendations

- **Adaptive Suggestions**: Recommendations tailored to your stress level
- **Practical Techniques**: Actionable stress management exercises
- **Breathing Guidance**: Instructions for proven breathing techniques
- **Wellness Tips**: General mental health and self-care advice

## 🛠️ Technology Stack

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **Shadcn/UI**: High-quality UI components
- **Recharts**: Responsive charting library for data visualization
- **Web Audio API**: For voice recording capabilities

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express**: Web framework for Node.js
- **AssemblyAI**: API for speech-to-text and sentiment analysis

### Data Storage
- **localStorage**: Client-side storage for stress history

## 📂 Project Structure

The project follows a clean architecture with separate client and server components:

```
VoiceStressAnalyzer/
├── client/               # Frontend React application
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # UI components
│       │   ├── chat/     # Chatbot interface components
│       │   ├── layout/   # Layout components
│       │   ├── stress/   # Stress analysis components
│       │   └── ui/       # Reusable UI components
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utility functions
│       ├── pages/        # Page components
│       └── types.ts      # TypeScript type definitions
├── server/               # Backend Node.js server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Data storage utilities
│   └── vite.ts           # Vite configuration for server
└── shared/               # Shared code between client and server
    └── schema.ts         # Shared data schemas
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- AssemblyAI API key (for voice analysis)
- Google Generative AI API key (for the chatbot)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/harshraj001/VoiceStressAnalyzer.git
   cd VoiceStressAnalyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key
   GOOGLE_GENERATIVE_AI_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## 📱 Usage

### Analyzing Your Voice

1. Navigate to the chat interface
2. Click the microphone button to start recording
3. Speak naturally for at least 5-10 seconds
4. Click the stop button to end recording
5. Wait for the analysis to complete
6. View your stress level results and recommendations

### Checking Stress History

1. Navigate to the Stress History page
2. View your stress level trends over time
3. Use the time range filters to focus on specific periods
4. Click on any entry to see detailed analysis

## ⚙️ How It Works

### Voice Analysis Process

1. **Recording**: The application captures your voice using the browser's Web Audio API
2. **Processing**: The audio is sent to the server as a WAV file
3. **Transcription**: AssemblyAI converts speech to text
4. **Analysis**: Multiple factors are analyzed:
   - **Sentiment Analysis**: Determines emotional tone of speech
   - **Speech Pace**: Calculates words per minute (WPM)
   - **Voice Tone**: Estimates tension in voice (derived from sentiment and pace)
   - **Voice Tremor**: Estimates tremor indicators (derived from sentiment and pace)
5. **Scoring**: Each factor contributes to an overall stress score
6. **Recommendation**: Personalized suggestions based on stress level
7. **Visualization**: Results are displayed with clear indicators and charts

### Stress Level Calculation

The overall stress level is a weighted combination of four primary factors:
- Voice tone (30%)
- Speech pace (25%)
- Voice tremor (20%)
- Sentiment negativity (25%)

Results are presented on a scale from 1-100:
- Low Stress (1-40)
- Medium Stress (41-70)
- High Stress (71-100)

## 🔌 API Integration

### AssemblyAI Integration

The server uses AssemblyAI's API to:
1. Transcribe spoken audio to text
2. Analyze sentiment in the transcribed text
3. Extract audio metadata (duration, etc.)

The results are combined with additional analysis to generate the comprehensive stress profile.

## 📊 Stress Analysis Metrics

### Voice Tone
- **Low (Calm)**: Relaxed speaking pattern
- **Medium (Slightly Tense)**: Mild tension detected
- **High (Tense)**: Significant tension in speech pattern

### Speech Pace
- **Low (Slow)**: Below 100 words per minute
- **Medium (Normal)**: 100-150 words per minute
- **High (Accelerated)**: Above 150 words per minute

### Voice Tremor
- **Low (Minimal)**: Steady voice pattern
- **Medium (Moderate)**: Some unsteadiness detected
- **High (Significant)**: Notable tremor in voice

### Sentiment
- **Low (Positive)**: Positive emotional content
- **Medium (Moderately Negative)**: Mixed emotional content
- **High (Negative)**: Negative emotional content

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📤 Repository

This project is hosted on GitHub:
https://github.com/harshraj001/VoiceStressAnalyzer

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Designed and developed with ❤️ for mental wellness support.
