import { Theme } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { Send, User as UserIcon, Bot, Loader2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/src/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: any;
}

export default function ChatView({ theme, user }: { theme: Theme, user: any }) {
  const isCosmic = theme === 'cosmic';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!user?.firebase?.uid) return;

    const q = query(
      collection(db, 'chats', user.firebase.uid, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Add user message to Firestore
      await addDoc(collection(db, 'chats', user.firebase.uid, 'messages'), {
        role: 'user',
        content: userMessage,
        timestamp: serverTimestamp()
      });

      // We only send the recent context to save tokens, or send all.
      const chatHistory = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      chatHistory.push({ role: 'user', content: userMessage });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.body) throw new Error('No readable stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullModelResponse = "";
      setStreamingContent("");

      setIsLoading(false); // Enable input while receiving stream. Displaying custom streamer.

      // We handle streaming by creating an empty model message in Firestore first
      const modelDocRef = await addDoc(collection(db, 'chats', user.firebase.uid, 'messages'), {
        role: 'model',
        content: '',
        timestamp: serverTimestamp()
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullModelResponse += data.text;
                setStreamingContent(fullModelResponse);
              }
            } catch (err) {
              // Ignore invalid JSON chunks
            }
          }
        }
      }

      setStreamingContent("");

      // Update final message in Firestore
      const { updateDoc } = await import('firebase/firestore');
      await updateDoc(modelDocRef, {
        content: fullModelResponse
      });

    } catch (error) {
      console.error("Chat error:", error);
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Please log in to use the Chatbot.</p>
      </div>
    );
  }

  return (
    <motion.div>
      <div className="mb-8">
        <h1 className={cn(
          "text-3xl font-bold font-sans tracking-tight mb-2",
          isCosmic ? "text-slate-100" : "text-slate-900"
        )}>
          Genesis AI
        </h1>
        <p className={cn(
           "text-sm font-mono uppercase tracking-widest",
           isCosmic ? "text-indigo-400" : "text-indigo-600"
        )}>
          High Intelligence Protocol
        </p>
      </div>

      <div className={cn(
        "rounded-[2.5rem] p-6 sm:p-8 border h-[600px] flex flex-col relative overflow-hidden",
        isCosmic ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      )}>
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide py-4">
           {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
               <Bot size={48} className={isCosmic ? "text-slate-500" : "text-slate-400"} />
               <p className="font-sans">Hello {user.firebase.displayName?.split(' ')[0] || 'User'}, how can I assist you today?</p>
             </div>
           )}

           {messages.map((msg, i) => {
             const isUser = msg.role === 'user';
             if (msg.role === 'model' && msg.content === '') {
               // Show streamed content
               if (streamingContent) {
                 return (
                   <div key={msg.id || i} className="flex gap-4 mr-auto max-w-[80%]">
                     <div className={cn(
                       "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                       isCosmic ? "bg-slate-800 text-indigo-400" : "bg-slate-100 text-indigo-600"
                     )}>
                       <Bot size={18} />
                     </div>
                     <div className={cn(
                       "p-4 rounded-2xl md:rounded-3xl",
                       isCosmic ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-800"
                     )}>
                       <p className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
                         {streamingContent}
                       </p>
                     </div>
                   </div>
                 );
               }
               // Otherwise wait empty
               return null;
             }

             return (
               <div key={msg.id || i} className={cn(
                 "flex gap-4 max-w-[80%]",
                 isUser ? "ml-auto flex-row-reverse" : "mr-auto"
               )}>
                 <div className={cn(
                   "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                   isUser 
                    ? (isCosmic ? "bg-indigo-600 text-white" : "bg-indigo-600 text-white") 
                    : (isCosmic ? "bg-slate-800 text-indigo-400" : "bg-slate-100 text-indigo-600")
                 )}>
                   {isUser ? <UserIcon size={18} /> : <Bot size={18} />}
                 </div>
                 
                 <div className={cn(
                   "p-4 rounded-2xl md:rounded-3xl",
                   isUser 
                    ? (isCosmic ? "bg-indigo-600 text-white" : "bg-indigo-600 text-white")
                    : (isCosmic ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-800")
                 )}>
                   <p className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
                     {msg.content}
                   </p>
                 </div>
               </div>
             )
           })}

           {isLoading && (
             <div className="flex gap-4 mr-auto max-w-[80%]">
               <div className={cn(
                 "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                 isCosmic ? "bg-slate-800 text-indigo-400" : "bg-slate-100 text-indigo-600"
               )}>
                 <Loader2 size={18} className="animate-spin" />
               </div>
               <div className={cn(
                 "p-4 rounded-3xl flex items-center gap-2",
                 isCosmic ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-800"
               )}>
                 <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
                 <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-75"></span>
                 <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-150"></span>
               </div>
             </div>
           )}

           <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-4 relative z-10 p-2">
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-full border",
            isCosmic ? "bg-slate-950 border-slate-700" : "bg-white border-slate-300 shadow-sm"
          )}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent px-4 py-2 font-sans focus:outline-none placeholder:text-slate-500"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-3 rounded-full flex items-center justify-center transition-colors shrink-0",
                isCosmic ? "bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-500" : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-100 disabled:text-slate-400"
              )}
            >
              <Send size={18} className={cn({ "translate-x-0.5 -translate-y-0.5": input.trim() && !isLoading })} />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
