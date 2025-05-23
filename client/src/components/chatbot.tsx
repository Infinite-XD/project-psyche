// chatbot.tsx
import React, { useEffect, useState, useRef, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from "../components/Navigation";
import MascotIcon from '../components/MascotIcon';
import "../styles/globals.css";

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch history on mount
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/chat/history', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch chat history');
        const data = await res.json();
        setMessages(data.history);
      } catch (err) {
        console.error(err);
      }
    }
    fetchHistory();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = { sender: 'user', text: inputText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: userMsg.text }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      const { reply } = await res.json();
      setMessages(prev => [...prev, reply]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp to a readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isMounted) return null;

  return (
<div
   className="h-screen flex flex-col items-center py-5 pb-20 overflow-hidden"
   style={{ background: 'linear-gradient(135deg, #070707 0%, #141414 100%)' }}
>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(168, 48, 48, 0) 70%)',
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: 'blur(40px)',
                opacity: Math.random() * 0.3 + 0.1,
                transform: 'translate(-50%, -50%)',
                animation: `floatEffect ${Math.random() * 10 + 20}s infinite ease-in-out`
              }}
            />
          ))}
        </div>
      </div>

      {/* Responsive wrapper */}
      <div className="w-full flex flex-col items-center mt-6 mb-6">
        <div className="w-full relative">
          {/* Glow layers */}
          <div
            className="absolute inset-0 rounded-2xl opacity-20 blur-xl -z-10"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 70%)' }}
          />
          <div
            className="absolute inset-0 rounded-2xl -z-10 animate-pulse-slow"
            style={{ background: 'linear-gradient(45deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.1) 100%)' }}
          />

          {/* Main card */}
          <div
            className="bg-black backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-900 relative overflow-hidden"
            style={{
              height: 'calc(100vh - 5rem - 2rem)',
              minHeight: '500px',
            }}
          >
            {/* Neon top line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent/20 to-black" />

            {/* Messages container */}
            <div
              className="relative h-full overflow-y-auto space-y-4 p-4 pb-20 custom-scrollbar"
              style={{ boxSizing: 'border-box' }}
            >
              {messages.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className="animate-bounce-slow scale-90 mb-2"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', 'mascot');
                    }}
                  >
                    <MascotIcon />
                  </div>
                  <p className="text-gray-400 text-sm">How can I help you today?</p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="flex flex-col max-w-[85%] px-2"> {/* reduced side padding on each message bubble */}
                  <div
                    className={`p-3 rounded-xl shadow-md whitespace-pre-wrap break-words
                      ${msg.sender === 'bot'
                        ? 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none'
                        : 'bg-accent/20 border border-accent/30 text-white rounded-tr-none'
                      }`}
                  >
                      {msg.text}
                    </div>
                    <span
                      className={`text-xs mt-1 text-gray-500
                        ${msg.sender === 'bot' ? 'text-left ml-1' : 'text-right mr-1'}`}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="absolute bottom-0 left-0 w-full px-4 py-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="h-px bg-gradient-to-r from-black via-accent/30 to-black mb-2" />
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="relative flex-1 group">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              placeholder="Type your message..."
              rows={1}
              className="w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition duration-300 group-hover:border-gray-700 resize-none overflow-auto"
              style={{ backgroundColor: '#111111', lineHeight: '1.5' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  // send on Enter
                  e.preventDefault();
                  handleSubmit(e);
                }
                // otherwise, default: allow newline (Shift+Enter)
              }}
            />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-accent transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative text-white font-medium rounded-lg transition-transform duration-300 transform hover:scale-[1.02] flex items-center justify-center px-4"
                  style={{
                    background: 'linear-gradient(45deg, rgba(60,60,60,1) 0%, rgba(20,20,20,1) 100%)'
                  }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed nav */}
      <div className="fixed inset-x-0 bottom-0 bg-black">
        <Navigation />
      </div>
    </div>
  );
}
