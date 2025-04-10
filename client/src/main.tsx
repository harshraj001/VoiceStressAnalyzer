import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "VoiceEase - Voice Stress Analysis Chatbot";

// Add meta description
if (!document.querySelector('meta[name="description"]')) {
  const metaDescription = document.createElement('meta');
  metaDescription.name = 'description';
  metaDescription.content = 'VoiceEase - Analyze your stress levels through voice input and get personalized stress management tips.';
  document.head.appendChild(metaDescription);
}

// Add preconnect to external resources
const preconnectFonts = document.createElement('link');
preconnectFonts.rel = 'preconnect';
preconnectFonts.href = 'https://fonts.googleapis.com';
document.head.appendChild(preconnectFonts);

const preconnectFonts2 = document.createElement('link');
preconnectFonts2.rel = 'preconnect';
preconnectFonts2.href = 'https://fonts.gstatic.com';
preconnectFonts2.crossOrigin = 'anonymous';
document.head.appendChild(preconnectFonts2);

// Add font links
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&display=swap';
document.head.appendChild(fontLink);

createRoot(document.getElementById("root")!).render(<App />);
