"use client";

import { useState, useTransition } from "react";
import { fixGrammarAction } from "@/app/actions/grammar";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Sparkles, Copy, Check, RefreshCw, AlertCircle } from "lucide-react";

export default function GrammarFixerPage() {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ corrected: string; explanation: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFix = () => {
    if (!text.trim()) return;
    setError(null);
    setResult(null);

    startTransition(async () => {
      const res = await fixGrammarAction(text);
      if (res.error) {
        setError(res.error);
      } else if (res.result) {
        // Parse the result
        const parts = res.result.split("[EXPLANATION]");
        const corrected = parts[0]?.replace("[CORRECTED]", "").trim() || "";
        const explanation = parts[1]?.trim() || "";
        setResult({ corrected, explanation });
      }
    });
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.corrected);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Pencil className="h-7 w-7 text-emerald-400" />
          AI Grammar Fixer
        </h1>
        <p className="text-slate-400 mt-1">
          Polish your English writing, fix spelling errors, and understand grammatical mistakes instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Input Textarea Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Enter your text to analyze
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here (e.g. He go to school yesterday but he forgot he's homework...)"
            rows={6}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 resize-y"
          />

          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-slate-500 font-mono">
              {text.length} characters
            </span>
            <button
              onClick={handleFix}
              disabled={isPending || !text.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 font-semibold text-sm text-white hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-emerald-600/10"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Fix Grammar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton wrapper */}
        {isPending && (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 rounded-2xl bg-slate-900/40 border border-slate-800/50 p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-800 rounded" />
                <div className="h-6 w-full bg-slate-800 rounded" />
              </div>
              <div className="h-3 w-16 bg-slate-800 rounded" />
            </div>
            <div className="h-40 rounded-2xl bg-slate-900/40 border border-slate-800/50 p-6 space-y-3">
              <div className="h-4 w-28 bg-slate-800 rounded" />
              <div className="h-3 w-5/6 bg-slate-800 rounded" />
              <div className="h-3 w-4/6 bg-slate-800 rounded" />
            </div>
          </div>
        )}

        {/* Results Showcase Card */}
        <AnimatePresence>
          {result && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Corrected Text Card */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Corrected Text
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-white text-lg font-medium leading-relaxed">
                  {result.corrected}
                </p>
              </div>

              {/* Explanation Card */}
              {result.explanation && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-4">
                    Grammar Explanation
                  </span>
                  <div className="text-slate-300 text-sm leading-relaxed space-y-2 font-sans prose prose-invert">
                    {result.explanation.split("\n").map((line, i) => {
                      const cleanLine = line.replace(/^[*\-\s]+/, "");
                      if (!cleanLine.trim()) return null;
                      return (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="text-purple-500 mt-1.5 shrink-0">•</span>
                          <span>{cleanLine}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
