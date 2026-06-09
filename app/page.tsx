"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Brain, BookOpen, Calculator, Pencil, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <Brain className="h-6 w-6 text-purple-500" />
          <span>Study<span className="text-purple-500">AI</span></span>
        </div>
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-slate-200"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12 z-10 flex-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl flex flex-col gap-6"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold w-fit"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Personalized Learning Assistant
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Learn Smarter, <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Not Harder.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-slate-400 leading-relaxed max-w-lg"
          >
            StudyAI is your ultimate learning companion. Solve math step-by-step, fix your grammar, summarize complex notes, and consult an AI tutor 24/7.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/signup"
              className="px-6 py-3.5 rounded-xl bg-purple-600 font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 group text-white shadow-lg shadow-purple-500/20 active:scale-98"
            >
              Get Started Free
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 font-semibold hover:bg-slate-800 transition-all flex items-center justify-center text-slate-200"
            >
              Access Dashboard
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg"
        >
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Pencil className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white">Grammar Fixer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fix structural mistakes and explain the rules in clear bullet points.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white">Math Explainer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explain algebra, arithmetic, and calculus with clear step-by-step math rendering.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col gap-4">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white">Notes Summarizer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Condense notes up to 2000 words. Generates core summaries and exam revision hints.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white">AI Tutor Chat</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Chat interactively with a smart companion that remembers past conversation threads.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-600 z-10">
        © {new Date().getFullYear()} StudyAI. All rights reserved.
      </footer>
    </div>
  );
}
