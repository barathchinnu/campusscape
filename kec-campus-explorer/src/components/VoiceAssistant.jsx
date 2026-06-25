import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { BUILDINGS } from '../data/campusData';

export default function VoiceAssistant() {
  const voiceAssistantActive = useGameStore((s) => s.voiceAssistantActive);
  const setVoiceAssistantActive = useGameStore((s) => s.setVoiceAssistantActive);
  const playerPosition = useGameStore((s) => s.playerPosition);
  const setGpsTarget = useGameStore((s) => s.setGpsTarget);
  const showToast = useGameStore((s) => s.showToast);

  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('How can I help you today?');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setTranscript('Listening...');
    };

    rec.onerror = (e) => {
      console.error(e);
      setIsListening(false);
      setTranscript('Error listening. Try again.');
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      processVoiceCommand(text);
    };

    recognitionRef.current = rec;
  }, []);

  // Toggle listening state based on store active state
  useEffect(() => {
    if (voiceAssistantActive) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error(e);
        }
      } else {
        setAiResponse('Speech recognition not supported on this browser. Try Chrome!');
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setTranscript('');
      setAiResponse('How can I help you today?');
    }
  }, [voiceAssistantActive]);

  // Speak function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processVoiceCommand = (rawText) => {
    const text = rawText.toLowerCase();
    
    // Find if a building is mentioned
    let matchedBuilding = null;
    let minDistance = 99999;
    
    for (const b of BUILDINGS) {
      const nameLower = b.name.toLowerCase();
      if (text.includes(nameLower) || (b.aliases && b.aliases.some(alias => text.includes(alias.toLowerCase())))) {
        matchedBuilding = b;
        break;
      }
    }

    // Default synonyms
    if (!matchedBuilding) {
      if (text.includes('library')) matchedBuilding = BUILDINGS.find(b => b.name.includes('Library'));
      if (text.includes('food') || text.includes('canteen') || text.includes('mess')) matchedBuilding = BUILDINGS.find(b => b.name.includes('Food'));
      if (text.includes('placement') || text.includes('admin') || text.includes('office')) matchedBuilding = BUILDINGS.find(b => b.name.includes('Admin'));
      if (text.includes('it park') || text.includes('software')) matchedBuilding = BUILDINGS.find(b => b.name.includes('IT Park'));
    }

    if (matchedBuilding) {
      const px = playerPosition[0];
      const pz = playerPosition[2];
      const tx = matchedBuilding.position[0];
      const tz = matchedBuilding.position[2];
      const dx = tx - px;
      const dz = tz - pz;
      const distMetres = Math.round(Math.sqrt(dx * dx + dz * dz) * 3);

      setGpsTarget(matchedBuilding);
      const reply = `${matchedBuilding.name} is ${distMetres} meters away. Setting GPS navigation target.`;
      setAiResponse(reply);
      speakText(reply);
      showToast(`🎯 GPS Navigation set to ${matchedBuilding.name}`);
    } else if (text.includes('hello') || text.includes('hi ')) {
      const reply = "Hello! I am your KEC Campus Voice Assistant. Ask me to take you to any building, like the Library or IT Park.";
      setAiResponse(reply);
      speakText(reply);
    } else if (text.includes('time')) {
      const h = new Date().getHours();
      const m = new Date().getMinutes();
      const reply = `The current time is ${h % 12 || 12} ${m} ${h >= 12 ? 'PM' : 'AM'}.`;
      setAiResponse(reply);
      speakText(reply);
    } else {
      const reply = "Sorry, I couldn't find that location. Try asking: Take me to the Library.";
      setAiResponse(reply);
      speakText(reply);
    }
  };

  if (!voiceAssistantActive) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2500,
      background: 'rgba(5, 10, 20, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Voice Assistant Panel */}
      <div style={{
        background: 'linear-gradient(135deg, #0e1e38 0%, #060e1b 100%)',
        border: '2px solid #3498db',
        borderRadius: 24,
        width: 420,
        padding: '30px 24px',
        boxShadow: '0 12px 40px rgba(52, 152, 219, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        color: '#fff',
        position: 'relative',
        animation: 'zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Close Button */}
        <button
          onClick={() => setVoiceAssistantActive(false)}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: '50%',
            color: '#fff',
            width: 32,
            height: 32,
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Glow Mic Circle */}
        <div style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: isListening ? '#2ecc71' : '#3498db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: isListening 
            ? '0 0 35px rgba(46, 204, 113, 0.7)' 
            : '0 0 25px rgba(52, 152, 219, 0.4)',
          transition: 'all 0.3s',
          cursor: 'pointer',
        }}
        onClick={() => recognitionRef.current && recognitionRef.current.start()}
        >
          🎙️
        </div>

        {/* Status Wave animation */}
        {isListening ? (
          <div style={{ display: 'flex', gap: 4, height: 24, alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{
                width: 4,
                height: 16,
                background: '#2ecc71',
                borderRadius: 2,
                animation: `bounce 0.6s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.1}s`,
              }} />
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: '#aaa' }}>Click the mic to speak</div>
        )}

        {/* Speech Transcript */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          width: '100%',
          padding: '12px 16px',
          fontSize: 14,
          minHeight: 50,
          textAlign: 'center',
          fontStyle: 'italic',
          color: '#e0e0e0',
        }}>
          {transcript || '"Say: Take me to the Library"'}
        </div>

        {/* AI Response Bubble */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(52,152,219,0.2) 0%, rgba(52,152,219,0.05) 100%)',
          border: '1px solid rgba(52, 152, 219, 0.3)',
          borderRadius: 16,
          width: '100%',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 10, color: '#3498db', fontWeight: 800, marginBottom: 4, letterSpacing: '0.08em' }}>
            AI CAMPUS GUIDE
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: '1.4' }}>
            {aiResponse}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          from { height: 6px; }
          to { height: 24px; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
