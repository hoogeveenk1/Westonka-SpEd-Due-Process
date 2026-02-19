
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService.ts';
import { ChatMessage, AppRoute } from '../types.ts';

interface AssistantProps {
  onNavigate?: (route: AppRoute) => void;
}

const Assistant: React.FC<AssistantProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "Hello! I'm your Westonka SpEd Due Process Assistant. To provide the most accurate compliance guidance, are you asking about Birth to 3 (Part C) or K-12 (Part B)?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Diagnostic check for the API
    const checkApi = async () => {
      try {
        // Just a tiny test call to check connectivity
        await geminiService.sendMessage("test connection");
        setApiStatus('connected');
      } catch (e) {
        console.error("Diagnostic failure:", e);
        setApiStatus('error');
      }
    };
    checkApi();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, streamingMessage]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    const userText = input;
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      let fullResponse = '';
      const stream = geminiService.sendMessageStream(userText, history);
      
      for await (const chunk of stream) {
        if (chunk) {
          fullResponse += chunk;
          setStreamingMessage(fullResponse);
        }
      }

      const modelMessage: ChatMessage = { 
        role: 'model', 
        text: fullResponse || "I'm sorry, I couldn't process that request.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, modelMessage]);
      setStreamingMessage('');
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('error');
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "I encountered an error. Please check your connection or district credentials in the Vercel dashboard.", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-inner">
            🤖
          </div>
          <div>
            <h2 className="font-bold text-slate-900 leading-tight">Due Process Agent</h2>
            <div className="flex items-center gap-2 mt-0.5">
              {apiStatus === 'checking' && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checking API...</span>
                </span>
              )}
              {apiStatus === 'connected' && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">API Active</span>
                </span>
              )}
              {apiStatus === 'error' && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">API Connection Error</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {onNavigate && (
          <button 
            onClick={() => onNavigate(AppRoute.PLAYBOOK)}
            className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            View Playbook
          </button>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-red-600 text-white rounded-tr-none border border-red-700 font-medium' 
                : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none font-semibold'}
            `}>
              <div className="whitespace-pre-wrap">
                {msg.text}
              </div>
              <div className={`text-[10px] mt-2 font-bold uppercase tracking-tighter opacity-60 ${msg.role === 'user' ? 'text-red-100 text-right' : 'text-slate-400 text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {streamingMessage && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="max-w-[85%] px-5 py-3 rounded-2xl rounded-tl-none bg-white border border-slate-200 text-slate-900 text-[15px] leading-relaxed shadow-sm font-semibold">
              <div className="whitespace-pre-wrap">
                {streamingMessage}
                <span className="inline-block w-1.5 h-4 ml-1 bg-red-500 animate-pulse align-middle"></span>
              </div>
            </div>
          </div>
        )}

        {isLoading && !streamingMessage && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Analyzing context...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <div className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="E.g. What is the IFSP referral timeline?"
            className="flex-1 px-5 py-4 bg-slate-100 border-2 border-transparent rounded-2xl text-base text-slate-900 font-semibold focus:ring-0 focus:border-red-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 bg-red-600 text-white rounded-2xl hover:bg-red-700 disabled:opacity-40 transition-all flex items-center justify-center shadow-lg shadow-red-600/20 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4">
          <svg className="w-3 h-3 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
            Consult official WPS (0277) documentation for final verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
