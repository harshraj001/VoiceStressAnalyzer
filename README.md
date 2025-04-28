# VoiceEase: Voice Stress Analysis Chatbot

VoiceEase is a comprehensive web application designed to analyze stress levels through voice input and provide personalized stress management recommendations. It features a conversational chatbot for mental wellness support, real-time voice stress detection, guided breathing exercises, and detailed stress history tracking and visualization.

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
- [Interactive Breathing Exercises](#interactive-breathing-exercises)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

VoiceEase is built to help users monitor and manage their stress levels through voice analysis. The application integrates advanced speech processing technologies with a user-friendly interface, allowing users to:

- Record their voice for real-time stress analysis
- Receive personalized stress management recommendations
- Access guided interactive breathing exercises
- Track their stress levels over time
- Chat with an AI-powered mental wellness assistant
- Upload audio files for offline analysis

This tool serves as a personal stress management companion, providing immediate feedback on stress indicators detected in users' voice patterns and offering practical tools for stress reduction.

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

### 4. Interactive Breathing Exercises

- **4-7-8 Breathing Technique**: Guided animation for this proven stress-reduction method
- **Visual Progress Indicators**: Color-coded circle that expands and contracts with your breath
- **Step-by-Step Guidance**: Clear instructions for each breath phase
- **Customizable Experience**: Available from sidebar or stress analysis results
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

### 5. Personalized Recommendations

- **Adaptive Suggestions**: Recommendations tailored to your stress level
- **Practical Techniques**: Actionable stress management exercises
- **Immediate Stress Relief**: Direct access to breathing exercises from recommendations
- **Wellness Tips**: General mental health and self-care advice

## 🧘 Interactive Breathing Exercises

VoiceEase includes a guided 4-7-8 breathing exercise feature designed to provide immediate stress relief based on Dr. Andrew Weil's renowned breathing technique.

### How the Breathing Exercise Works

The 4-7-8 breathing technique (also called the "relaxing breath") is designed to reduce anxiety and help people get to sleep. It works by:

1. **Inhale**: Breathe in quietly through your nose for 4 seconds
2. **Hold**: Hold your breath for a count of 7 seconds
3. **Exhale**: Exhale completely through your mouth for 8 seconds
4. **Repeat**: Complete this cycle three times for optimal results

### Features of the Breathing Exercise

- **Visual Guidance**: An animated circle expands and contracts with your breath pattern
- **Color-Coded Phases**: Different colors for inhale, hold, and exhale phases
   - Blue: Inhale phase
   - Purple: Hold phase
   - Green: Exhale phase
- **Countdown Timer**: Visual countdown for each breath phase
- **Cycle Counter**: Tracks progress through the recommended three cycles
- **Responsive Design**: Fully adapted for both desktop and mobile viewing
- **Accessibility**: Clear text instructions accompany visual elements
- **Theme Support**: Seamless integration with both light and dark mode

### Where to Find It

The breathing exercise can be accessed in two ways:

1. **From the Sidebar**: Click on "Breathing Exercise" in the main navigation
2. **From Analysis Results**: Click "Try Breathing Exercise" in stress analysis results modal

This feature provides a practical tool for immediate stress management, requiring no equipment or special training to be effective.

## 🛠️ Technology Stack

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **Shadcn/UI**: High-quality UI components
- **Recharts**: Responsive charting library for data visualization
- **Web Audio API**: For voice recording capabilities
- **SVG Animations**: For interactive breathing exercise visualizations

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

### Using the Breathing Exercise

1. Access from the sidebar navigation menu by clicking "Breathing Exercise"
2. Alternatively, access from stress analysis results by clicking "Try Breathing Exercise" 
3. Follow the animated circle - expand as it grows, contract as it shrinks
4. Complete the 4-7-8 breathing cycle (inhale 4s, hold 7s, exhale 8s)
5. Repeat for three full cycles for optimal stress relief

### Uploading Audio Files

1. In the chat interface, click "Upload Audio"
2. Select an audio file from your device (.wav, .mp3, etc.)
3. Wait for the analysis to complete
4. View your stress analysis results and recommendations

## ⚙️ How It Works

### Voice Analysis Process

1. **Recording**: The application captures your voice using the browser's Web Audio API
2. **Processing**: The audio is sent to the server as a WAV file
3. **Robust Audio Parsing**: Multi-level audio processing with fallbacks for various formats
4. **Transcription**: AssemblyAI converts speech to text
5. **Analysis**: Multiple factors are analyzed:
   - **Sentiment Analysis**: Determines emotional tone of speech
   - **Speech Pace**: Calculates words per minute (WPM)
   - **Voice Tone**: Estimates tension in voice (derived from sentiment and pace)
   - **Voice Tremor**: Estimates tremor indicators (derived from sentiment and pace)
6. **Scoring**: Each factor contributes to an overall stress score
7. **Recommendation**: Personalized suggestions based on stress level
8. **Visualization**: Results are displayed with clear indicators and charts
9. **Action Options**: Direct access to breathing exercises from analysis results

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

## 🔄 Recent Updates

### April 2025 Update
- **Added Interactive Breathing Exercises**: New 4-7-8 breathing technique feature with visual guidance
- **Improved Navigation**: Breathing exercise accessible from sidebar for better discoverability
- **Enhanced Stress Analysis Modal**: "Try Breathing Exercise" button added to analysis results
- **Audio File Upload**: Support for analyzing pre-recorded audio files
- **UI Improvements**: Better responsiveness and theme consistency across components
- **Performance Optimization**: Improved audio processing with better error handling

## 📤 Repository

This project is hosted on GitHub:
https://github.com/harshraj001/VoiceStressAnalyzer

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Designed and developed with ❤️ for mental wellness support.
