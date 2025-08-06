'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import 'animate.css/animate.min.css';

interface TranscriptEntry {
  type: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

interface ElevenLabsEvent extends Event {
  detail?: {
    config?: {
      enableTranscript?: boolean;
      enableUserTranscript?: boolean;
      enableAgentResponse?: boolean;
    };
    transcript?: string;
    response?: string;
  };
}

export default function MainPage() {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);

  // Add event listeners for transcript functionality
  useEffect(() => {
    const handleWidgetEvents = () => {
      const widget = document.querySelector('elevenlabs-convai');
      
      if (widget) {
        // Listen for widget initialization
        widget.addEventListener('elevenlabs-convai:call', (event: ElevenLabsEvent) => {
          console.log('Widget call started');
          
          // Enable transcript events in the widget configuration
          if (event.detail && event.detail.config) {
            event.detail.config.enableTranscript = true;
            event.detail.config.enableUserTranscript = true;
            event.detail.config.enableAgentResponse = true;
          }
        });

        // Listen for user transcript events
        widget.addEventListener('elevenlabs-convai:user_transcript', (event: ElevenLabsEvent) => {
          console.log('User said:', event.detail?.transcript);
          setTranscript(prev => [...prev, {
            type: 'user',
            text: event.detail?.transcript || 'User spoke...',
            timestamp: new Date()
          }]);
        });

        // Listen for agent response events
        widget.addEventListener('elevenlabs-convai:agent_response', (event: ElevenLabsEvent) => {
          console.log('Agent said:', event.detail?.response);
          setTranscript(prev => [...prev, {
            type: 'agent',
            text: event.detail?.response || 'Agent responded...',
            timestamp: new Date()
          }]);
        });

        // Listen for conversation events
        widget.addEventListener('elevenlabs-convai:conversation_started', () => {
          console.log('Conversation started');
          setIsCallActive(true);
          setTranscript([]);
        });

        widget.addEventListener('elevenlabs-convai:conversation_ended', () => {
          console.log('Conversation ended');
          setIsCallActive(false);
        });
      }
    };

    // Wait for the widget to be loaded
    const timer = setTimeout(handleWidgetEvents, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-6xl h-[80vh] sm:h-[83vh] mx-auto pb-20 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white rounded-2xl overflow-y-scroll scrollbar-hidden shadow-2xl border border-white/10 main-content-container">
      
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/bot-with-man.avif"
          alt="SpeakGrade Background"
          fill
          className="object-cover animate__animated animate__fadeIn"
          priority
        />
        <div className="absolute inset-0 bg-black/85" /> {/* Darker overlay for better text readability */}
      </div>

      {/* Glowing Background Blur */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse z-10" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-pink-500/20 rounded-full blur-2xl animate-pulse z-10" />

      {/* Main Content */}
      <div className="relative z-20 p-6 flex flex-col items-center justify-center text-center min-h-full">
        
        {/* Text content container with relative positioning for widget anchor */}
        <div className="relative z-20 text-center max-w-4xl mx-auto pt-56">
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight robotic-font mb-2">
            Have a quick conversation in English with a tutor to evaluate your level
          </h1>
          
          {/* Instructions */}
          <div className="space-y-1 mb-1">
            <p className="text-lg sm:text-xl text-cyan-400 font-medium robotic-font">
              1. Press the button below, then accept the terms.
            </p>
            <p className="text-lg sm:text-xl text-green-400 font-medium robotic-font" id="last-instruction">
              2. press the phone icon again to start the call
            </p>
          </div>

          {/* ElevenLabs Agent - Absolute positioned right below text */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
            style={{ 
              top: '69%',
              marginTop: '-10px',
              zIndex: 9999
            }}
            dangerouslySetInnerHTML={{
              __html: `<elevenlabs-convai 
                agent-id="agent_4501k1tk0ntff8rv8et3d804erbq"
                variant="expanded"
                avatar-image-url="/speakgrade_logo.png"
                avatar-orb-color-1="#00FFFF"
                avatar-orb-color-2="#9333EA"
                action-text="Start English Test"
                start-call-text="Begin Voice Test"
                end-call-text="End Test"
                expand-text="Open Voice Tutor"
                listening-text="Listening to you..."
                speaking-text="Manolo is speaking..."
                override-language="en"
              ></elevenlabs-convai>`,
            }}
          />

          {/* Load ElevenLabs Widget Script */}
          <Script
            src="https://unpkg.com/@elevenlabs/convai-widget-embed"
            strategy="afterInteractive"
            onLoad={() => {
              console.log('ElevenLabs widget script loaded');
            }}
          />
        </div>

        {/* Transcript Display */}
        {isCallActive && transcript.length > 0 && (
          <div className="fixed bottom-4 right-4 w-80 max-h-60 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20 z-50 overflow-y-auto scrollbar-hidden">
            <div className="text-sm text-white/70 mb-2 robotic-font">Live Transcript</div>
            <div className="space-y-2">
              {transcript.map((entry, index) => (
                <div key={index} className={`text-sm ${entry.type === 'user' ? 'text-cyan-400' : 'text-green-400'}`}>
                  <span className="font-semibold robotic-font">
                    {entry.type === 'user' ? 'You:' : 'Manolo:'}
                  </span>
                  <span className="ml-2">{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
