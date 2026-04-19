import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { askOracle } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Note } from './NotesRepo';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIOracle({ minimal = false }: { minimal?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Greeting student! I am the AI Oracle. I have matched Sem 4 OS notes. Ask any technical query.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setLoading(true);

    try {
      const notesSnap = await getDocs(collection(db, 'notes'));
      const allNotes = notesSnap.docs.map(doc => ({ ...doc.data() } as Note));
      const matchingNotes = allNotes.filter(note => 
        userQuery.toLowerCase().includes(note.subject.toLowerCase()) ||
        userQuery.toLowerCase().includes(note.title.toLowerCase())
      );
      const contextStrings = matchingNotes.map(n => 
        `Subject: ${n.subject} (Sem ${n.semester})\nTitle: ${n.title}\nContent: ${n.content}`
      );
      const response = await askOracle(userQuery, contextStrings);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error("Oracle error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "SYSTEM ERROR: Crystal ball focus lost." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden transition-all",
      minimal ? "bg-transparent border-none p-0 h-full" : "bg-white border border-zinc-200 rounded-2xl shadow-sm h-[calc(100vh-12rem)]"
    )}>
      <header className={cn(
        "px-6 py-4 flex items-center justify-between",
        minimal ? "bg-transparent border-none pb-4" : "border-b border-zinc-100 bg-zinc-50/50"
      )}>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
            minimal ? "bg-green-900/30 text-green-500" : "bg-blue-600 text-white"
          )}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className={cn("font-bold text-sm", minimal ? "text-white" : "text-zinc-900")}>AI ORACLE</h3>
            {!minimal && <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Gemini 1.5 Flash</p>}
          </div>
        </div>
        {minimal && <span className="text-[10px] font-mono bg-green-900/40 px-2 py-0.5 rounded text-green-400">v1.5</span>}
      </header>

      <div 
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar-mini",
          minimal ? "font-mono text-sm text-green-500/90" : "text-zinc-800"
        )}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-3 max-w-[90%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "px-4 py-3 rounded-xl leading-relaxed transition-colors",
                msg.role === 'user' 
                  ? minimal ? "bg-gray-800 text-white rounded-tr-none border border-gray-700" : "bg-blue-600 text-white rounded-tr-none" 
                  : minimal ? "bg-green-900/10 text-green-400 border border-green-900/20 rounded-tl-none" : "bg-zinc-50 text-zinc-800 border border-zinc-100 rounded-tl-none"
              )}>
                {msg.role === 'assistant' && minimal && <div className="text-[10px] opacity-50 mb-1 italic">SYSTEM: NOTES_MATCHED</div>}
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-3 animate-pulse">
            <div className={cn("px-4 py-2 rounded-xl rounded-tl-none", minimal ? "bg-green-900/5 border border-green-900/10" : "bg-zinc-50 border border-zinc-100")}>
               <Loader2 className={cn("w-4 h-4 animate-spin", minimal ? "text-green-900" : "text-zinc-400")} />
            </div>
          </div>
        )}
      </div>

      <div className={cn("p-4", minimal ? "bg-[#1f2937]/50 mt-auto" : "border-t border-zinc-100")}>
        <div className="relative flex items-center">
          <textarea 
            placeholder={minimal ? "Type query here..." : "Ask the Oracle anything..."}
            className={cn(
              "w-full pl-4 pr-12 py-3 focus:outline-none focus:ring-1 transition-all resize-none h-12 flex items-center pt-3",
              minimal 
                ? "bg-[#1f2937] border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-600 focus:ring-green-500/50" 
                : "bg-zinc-50 border-zinc-200 rounded-xl focus:ring-blue-500/20"
            )}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button 
            className={cn(
              "absolute right-2 p-2 rounded-lg transition-all",
              minimal ? "text-green-500 hover:text-green-400" : "bg-blue-600 text-white hover:bg-blue-700"
            )}
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {minimal ? <div className="text-[10px] font-bold uppercase tracking-tighter">Spark</div> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
