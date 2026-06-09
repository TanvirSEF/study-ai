"use client";

import { useState, useTransition } from "react";
import { summarizeAction } from "@/app/actions/summary";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, AlertCircle, RefreshCw, FileText, CheckCircle2, Award } from "lucide-react";

export default function NotesSummarizerPage() {
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ shortSummary: string; bullets: string; examTips: string } | null>(null);

  const getWordCount = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const wordCount = getWordCount(notes);

  const handleSummarize = () => {
    if (!notes.trim()) return;
    setError(null);
    setResult(null);

    startTransition(async () => {
      const res = await summarizeAction(notes);
      if (res.error) {
        setError(res.error);
      } else if (res.result) {
        // Parse results
        const text = res.result;
        const shortSummaryIndex = text.indexOf("[SHORT SUMMARY]");
        const bulletsIndex = text.indexOf("[KEY BULLET POINTS]");
        const examTipsIndex = text.indexOf("[EXAM TIPS]");

        let shortSummary = "";
        let bullets = "";
        let examTips = "";

        if (shortSummaryIndex !== -1) {
          const endOfSummary = bulletsIndex !== -1 ? bulletsIndex : (examTipsIndex !== -1 ? examTipsIndex : text.length);
          shortSummary = text.substring(shortSummaryIndex + "[SHORT SUMMARY]".length, endOfSummary).trim();
        }

        if (bulletsIndex !== -1) {
          const endOfBullets = examTipsIndex !== -1 ? examTipsIndex : text.length;
          bullets = text.substring(bulletsIndex + "[KEY BULLET POINTS]".length, endOfBullets).trim();
        }

        if (examTipsIndex !== -1) {
          examTips = text.substring(examTipsIndex + "[EXAM TIPS]".length).trim();
        }

        // Fallback in case tags got skipped or changed slightly
        if (!shortSummary && !bullets && !examTips) {
          shortSummary = text;
        }

        setResult({ shortSummary, bullets, examTips });
      }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-purple-400" />
          Smart Notes Summarizer
        </h1>
        <p className="text-slate-400 mt-1">
          Condense lectures, study guides, or long articles into structured summaries, key points, and revision exam tips.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Text Area Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Paste your notes (maximum 2,000 words)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your textbooks chapters, research paragraphs, or revision notes..."
            rows={8}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 resize-y"
          />

          <div className="flex justify-between items-center mt-4">
            <span className={`text-xs font-mono ${wordCount > 2000 ? "text-red-400" : "text-slate-500"}`}>
              Word count: {wordCount} / 2,000
            </span>
            <button
              onClick={handleSummarize}
              disabled={isPending || !notes.trim() || wordCount > 2000}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 font-semibold text-sm text-white hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-purple-600/10"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Summarize Notes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Handling */}
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

        {/* Loading Shimmer Skeleton */}
        {isPending && (
          <div className="space-y-4 animate-pulse">
            <div className="h-28 rounded-2xl bg-slate-900/40 border border-slate-800/50 p-6 space-y-2">
              <div className="h-4 w-28 bg-slate-800 rounded" />
              <div className="h-3 w-full bg-slate-800 rounded" />
              <div className="h-3 w-5/6 bg-slate-800 rounded" />
            </div>
            <div className="h-44 rounded-2xl bg-slate-900/40 border border-slate-800/50 p-6 space-y-2">
              <div className="h-4 w-32 bg-slate-800 rounded" />
              <div className="h-3 w-full bg-slate-800 rounded" />
              <div className="h-3 w-5/6 bg-slate-800 rounded" />
              <div className="h-3 w-4/6 bg-slate-800 rounded" />
            </div>
            <div className="h-28 rounded-2xl bg-slate-900/40 border border-slate-800/50 p-6 space-y-2">
              <div className="h-4 w-24 bg-slate-800 rounded" />
              <div className="h-3 w-5/6 bg-slate-800 rounded" />
            </div>
          </div>
        )}

        {/* Results Output */}
        <AnimatePresence>
          {result && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Short Summary Card */}
              {result.shortSummary && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-3 text-purple-400 font-semibold text-sm">
                    <FileText className="h-4 w-4" />
                    <span>Executive Summary</span>
                  </div>
                  <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
                    {result.shortSummary}
                  </p>
                </div>
              )}

              {/* Key Bullet Points Card */}
              {result.bullets && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-4 text-purple-400 font-semibold text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Key Concepts & Details</span>
                  </div>
                  <div className="space-y-3 text-slate-300 text-sm leading-relaxed prose prose-invert">
                    {result.bullets.split("\n").map((line, i) => {
                      const cleanLine = line.replace(/^[*\-\s\d\.\)]+/, "");
                      if (!cleanLine.trim()) return null;
                      return (
                        <div key={i} className="flex gap-2.5 items-start">
                          <span className="text-purple-500 mt-1.5 shrink-0">•</span>
                          <span>{cleanLine}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Exam Tips Card */}
              {result.examTips && (
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-3 text-purple-400 font-semibold text-sm">
                    <Award className="h-4 w-4" />
                    <span>Exam Revision & Core Takeaways</span>
                  </div>
                  <div className="space-y-3 text-slate-300 text-sm leading-relaxed prose prose-invert">
                    {result.examTips.split("\n").map((line, i) => {
                      const cleanLine = line.replace(/^[*\-\s\d\.\)]+/, "");
                      if (!cleanLine.trim()) return null;
                      return (
                        <div key={i} className="flex gap-2.5 items-start">
                          <span className="text-purple-400 mt-1.5 shrink-0">★</span>
                          <span className="text-slate-200 font-medium">{cleanLine}</span>
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
