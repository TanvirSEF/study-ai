"use client";

import { useState, useTransition } from "react";
import { explainMathAction } from "@/app/actions/math";
import MathRenderer from "@/components/dashboard/MathRenderer";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

export default function MathExplainerPage() {
  const [problem, setProblem] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleSolve = () => {
    if (!problem.trim()) return;
    setError(null);
    setResult(null);

    startTransition(async () => {
      const res = await explainMathAction(problem);
      if (res.error) {
        setError(res.error);
      } else if (res.result) {
        setResult(res.result);
      }
    });
  };

  // Helper to split steps and concept note for individual card rendering
  const parseResult = (text: string) => {
    if (!text) return [];

    // Regex to split by Step X or Concept Note, keeping the matches
    const parts = text.split(/(?=Step \d+|Concept Note)/i);
    return parts.map((part) => part.trim()).filter((part) => part.length > 0);
  };

  const steps = result ? parseResult(result) : [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Calculator className="h-7 w-7 text-blue-400" />
          Step-by-Step Math Explainer
        </h1>
        <p className="text-slate-400 mt-1">
          Solve complex mathematical problems from algebra, arithmetic, and calculus with clear step-by-step guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Input Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Enter mathematical problem
          </label>
          <input
            type="text"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g. Integrate x * sin(x) dx  or  Solve 2x + 5 = 15"
            disabled={isPending}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSolve();
            }}
          />

          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-slate-500 font-mono">
              Supports standard mathematical syntax and LaTeX symbols
            </span>
            <button
              onClick={handleSolve}
              disabled={isPending || !problem.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-blue-600/10"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Solving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Solve Problem
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

        {/* Loading Skeleton */}
        {isPending && (
          <div className="space-y-4 animate-pulse">
            <div className="h-28 rounded-2xl bg-slate-900/40 border border-slate-800/50 p-6 space-y-2">
              <div className="h-4 w-20 bg-slate-800 rounded" />
              <div className="h-3 w-5/6 bg-slate-800 rounded" />
              <div className="h-3 w-3/6 bg-slate-800 rounded" />
            </div>
            <div className="h-28 rounded-2xl bg-slate-900/40 border border-slate-800/50 p-6 space-y-2">
              <div className="h-4 w-20 bg-slate-800 rounded" />
              <div className="h-3 w-5/6 bg-slate-800 rounded" />
            </div>
            <div className="h-20 rounded-2xl bg-slate-900/40 border border-slate-800/50 p-6 space-y-2">
              <div className="h-4 w-32 bg-slate-800 rounded" />
              <div className="h-3 w-4/6 bg-slate-800 rounded" />
            </div>
          </div>
        )}

        {/* Math Results Steps */}
        <AnimatePresence>
          {result && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {steps.map((step, idx) => {
                const isConceptNote = step.toLowerCase().startsWith("concept note");
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`rounded-2xl border p-6 backdrop-blur-md shadow-md ${
                      isConceptNote
                        ? "border-purple-500/20 bg-purple-500/5"
                        : "border-slate-800 bg-slate-900/40"
                    }`}
                  >
                    <MathRenderer content={step} />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
