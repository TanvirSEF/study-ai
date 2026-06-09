"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pencil, Calculator, BookOpen, MessageSquare, ArrowRight } from "lucide-react";

export default function QuickActions() {
  const cards = [
    {
      title: "Grammar Fixer",
      description: "Correct English grammar mistakes and get clean bullet-point explanations.",
      href: "/dashboard/grammar",
      icon: Pencil,
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      title: "Math Explainer",
      description: "Solve complex algebraic, calculus, or arithmetic math steps with LaTeX support.",
      href: "/dashboard/math",
      icon: Calculator,
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      title: "Notes Summarizer",
      description: "Condense study notes and articles up to 2000 words into short key bullet points and exam tips.",
      href: "/dashboard/summary",
      icon: BookOpen,
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      title: "AI Tutor Chat",
      description: "Discuss topic concepts and ask educational questions to an interactive AI tutor.",
      href: "/dashboard/chat",
      icon: MessageSquare,
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            className="group block relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-colors hover:bg-slate-900/60"
          >
            <Link href={card.href} className="flex flex-col h-full justify-between">
              <div>
                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center mb-5 ${card.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-400 mt-6 group-hover:text-purple-300">
                Launch Tool
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
