"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { chatAction } from "@/app/actions/chat";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Sparkles, Loader2, User, Brain, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your AI Study Tutor. What topic or concept would you like to explore today? I can explain theories, solve questions, or test your knowledge!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing simulator effect
  const simulateStreaming = (text: string) => {
    let index = 0;
    const intervalTime = Math.max(10, Math.min(30, 1000 / text.length)); // Speed adapts to length

    // Add empty assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "", isStreaming: true }]);

    const interval = setInterval(() => {
      setMessages((prev) => {
        const copy = [...prev];
        const lastMsg = copy[copy.length - 1];
        if (lastMsg && lastMsg.role === "assistant" && lastMsg.isStreaming) {
          lastMsg.content = text.substring(0, index + 1);
        }
        return copy;
      });

      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setMessages((prev) => {
          const copy = [...prev];
          const lastMsg = copy[copy.length - 1];
          if (lastMsg) {
            delete lastMsg.isStreaming;
          }
          return copy;
        });
      }
    }, intervalTime);
  };

  const handleSend = () => {
    if (!input.trim() || isPending) return;
    setError(null);

    const userMessage = input.trim();
    setInput("");

    // Add User Message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    startTransition(async () => {
      // Exclude streaming tags
      const history = messages
        .filter((m) => !m.isStreaming)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await chatAction(history, userMessage);

      if (res.error) {
        setError(res.error);
      } else if (res.result) {
        simulateStreaming(res.result);
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto space-y-4">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-amber-400" />
          AI Tutor Chat
        </h1>
        <p className="text-slate-400 mt-1">
          Have interactive learning discussions and ask clarifying questions on any topic.
        </p>
      </div>

      {/* Chat Messages Body Container */}
      <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md overflow-y-auto space-y-4 shadow-lg min-h-[300px]">
        <div className="space-y-4">
          {messages.map((message, idx) => {
            const isUser = message.role === "user";
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 shadow-inner ${
                    isUser
                      ? "bg-purple-600/10 border-purple-500/20 text-purple-400"
                      : "bg-amber-600/10 border-amber-500/20 text-amber-400"
                  }`}
                >
                  {isUser ? <User className="h-4.5 w-4.5" /> : <Brain className="h-4.5 w-4.5" />}
                </div>

                {/* Bubble content */}
                <div
                  className={`rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? "bg-purple-600/15 border border-purple-500/25 text-slate-100"
                      : "bg-slate-950/40 border border-slate-800/80 text-slate-300"
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            );
          })}

          {/* Loading status bubbles */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[80%]"
            >
              <div className="h-8 w-8 rounded-lg bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Brain className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-slate-950/40 border border-slate-800/80 text-slate-500 flex items-center gap-2 text-sm italic">
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                Tutor is formulating response...
              </div>
            </motion.div>
          )}

          {/* Error Indicator inside Chat */}
          {error && (
            <div className="flex gap-3 max-w-full justify-center my-4">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold shadow">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or explain what you're working on..."
          disabled={isPending}
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          onClick={handleSend}
          disabled={isPending || !input.trim()}
          className="px-5 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 transition-all font-semibold text-white flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-amber-600/10"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
