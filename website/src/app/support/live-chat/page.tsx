"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Paperclip, Image as ImageIcon, Mic, Send, Bot, User, 
  HelpCircle, MonitorPlay, Users, GraduationCap, Settings, CreditCard, Code, Check, CheckCircle2, Clock, X, FileText 
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { generateResponse } from "@/lib/bot-logic";
import { validateFiles } from "@/lib/file-security";

const CHAT_FEATURES = [
  "AI Assistant", "Human Support", "Screen Sharing", 
  "File Upload", "Image Upload", "Voice Messages", 
  "Conversation History", "Ticket Creation", "Live Typing Indicator"
];

const COMMON_TOPICS = [
  { icon: HelpCircle, name: "Getting Started" },
  { icon: CheckCircle2, name: "Attendance Issues" },
  { icon: MonitorPlay, name: "SmartBoard Setup" },
  { icon: Users, name: "Faculty Portal" },
  { icon: GraduationCap, name: "Student App" },
  { icon: Settings, name: "Technical Support" },
  { icon: CreditCard, name: "Billing" },
  { icon: Code, name: "API Questions" }
];

export default function LiveChatPage() {
  const [messages, setMessages] = useState<Array<{id: string, role: string, content: string, time: string}>>([
    { id: "msg-1", role: "assistant", content: "Hi there! Welcome to IntelliAttend Support. How can we help you today?", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && files.length === 0) || isTyping) return;

    const userMsg = input.trim();
    const attachedFiles = [...files];
    
    let content = userMsg;
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map(f => f.name).join(", ");
      content += content ? `\n\n*(Attached: ${fileNames})*` : `*(Attached: ${fileNames})*`;
    }

    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      role: "user", 
      content: content,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]);
    
    setInput("");
    setFiles([]);
    setIsTyping(true);

    setTimeout(async () => {
      let response = "I can help with IntelliAttend's SmartBoards, faculty tools, student apps, attendance, and support. What would you like to know?";
      try {
        const botRes = await generateResponse(userMsg, { lastIntent: null, lastEntity: null, history: [] });
        if (botRes && botRes.text) response = botRes.text;
      } catch {
        // fallback
      }
      if (attachedFiles.length > 0 && !userMsg) {
        response = "I see you've attached a file. An agent will review it shortly! Is there anything else you'd like to add?";
      } else if (attachedFiles.length > 0) {
        response = "Thanks for attaching those files! " + response;
      }

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: response,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const { validFiles, errors } = validateFiles(selectedFiles);
      setFileErrors(errors);
      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
      }
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTopicClick = (topic: string) => {
    if (!isTyping) {
      setInput(`I need help with ${topic}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-sm mb-6 border border-emerald-100"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Agents Online • Avg Response: &lt; 2 mins • 24/7
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6"
          >
            Talk to an IntelliAttend Specialist
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#64748B] leading-relaxed"
          >
            Get real-time assistance for product questions, technical issues, onboarding, and implementation.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Info & Topics */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Common Topics</h3>
              <div className="grid grid-cols-2 gap-3">
                {COMMON_TOPICS.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleTopicClick(topic.name)}
                    className="flex items-center gap-2 text-left p-3 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <topic.icon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-[#0F172A]">{topic.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Chat Interface */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[650px] relative"
          >
            {/* Chat Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A]">IntelliAttend Support</h3>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overscroll-none p-6 bg-slate-50/50 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
              <div className="text-center text-xs font-medium text-slate-400 mb-8">
                Today at {mounted ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "..."}
              </div>
              
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                      msg.role === "user" ? "bg-slate-200" : "bg-primary"
                    )}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={cn(
                      "flex flex-col",
                      msg.role === "user" ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-5 py-3.5 rounded-2xl text-[15px] shadow-sm",
                        msg.role === "user" 
                          ? "bg-primary text-white rounded-tr-sm" 
                          : "bg-white border border-slate-100 text-[#0F172A] rounded-tl-sm"
                      )}>
                        <div className="prose prose-sm prose-p:leading-relaxed max-w-none">
                          <ReactMarkdown>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 mt-1.5 px-1">{msg.time}</span>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-3 max-w-[85%] mr-auto"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5 h-12">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.25, delay: 0 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.25, delay: 0.1 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.25, delay: 0.15 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2">
              
              {/* File Previews */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 px-1">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-lg">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span className="max-w-[120px] truncate">{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeFile(i)}
                        className="p-0.5 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Security Validation Errors */}
              {fileErrors.length > 0 && (
                <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  <div className="font-semibold flex items-center gap-1 text-rose-900 mb-0.5">
                    <span>Upload Error (max. 10MB, PNG/JPG/PDF/TXT only):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-rose-700">
                    {fileErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex items-end gap-2 relative">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  multiple 
                  accept=".png,.jpg,.jpeg,.pdf,.txt,image/png,image/jpeg,application/pdf,text/plain"
                />
                
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/10 transition-all p-1 flex items-center">
                  <div className="flex px-1">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-slate-400 hover:text-primary transition-colors rounded-xl hover:bg-primary/5"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-slate-400 hover:text-primary transition-colors rounded-xl hover:bg-primary/5"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-[#0F172A] px-2 py-3 outline-none min-w-0"
                  />
                  
                  <div className="pr-1">
                    <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors rounded-xl hover:bg-primary/5">
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={(!input.trim() && files.length === 0) || isTyping}
                  className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
