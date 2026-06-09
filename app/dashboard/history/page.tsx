"use client";

import { useState, useEffect, useTransition } from "react";
import { getHistoryAction, deleteHistoryItemAction, clearAllHistoryAction } from "@/app/actions/history";
import MathRenderer from "@/components/dashboard/MathRenderer";
import { motion, AnimatePresence } from "framer-motion";
import {
  History as HistoryIcon,
  Search,
  Trash2,
  AlertCircle,
  Pencil,
  Calculator,
  BookOpen,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
} from "lucide-react";

interface HistoryLog {
  id: string;
  toolType: string;
  title: string;
  prompt: string;
  response: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<HistoryLog[]>([]);
  const [search, setSearch] = useState("");
  const [toolFilter, setToolFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchHistory = () => {
    startTransition(async () => {
      setError(null);
      const res = await getHistoryAction(search, toolFilter);
      if (res.error) {
        setError(res.error);
      } else if (res.logs) {
        setLogs(res.logs);
      }
    });
  };

  // Debounced search trigger
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(delay);
  }, [search, toolFilter]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid expanding card when clicking delete
    if (!confirm("Are you sure you want to delete this log?")) return;

    const res = await deleteHistoryItemAction(id);
    if (res.error) {
      alert(res.error);
    } else {
      setLogs((prev) => prev.filter((log) => log.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to delete your entire history? This action cannot be undone.")) return;

    const res = await clearAllHistoryAction();
    if (res.error) {
      alert(res.error);
    } else {
      setLogs([]);
      setExpandedId(null);
    }
  };

  const getToolIcon = (type: string) => {
    switch (type) {
      case "grammar":
        return <Pencil className="h-4 w-4 text-emerald-400" />;
      case "math":
        return <Calculator className="h-4 w-4 text-blue-400" />;
      case "summary":
        return <BookOpen className="h-4 w-4 text-purple-400" />;
      case "chat":
        return <MessageSquare className="h-4 w-4 text-amber-400" />;
      default:
        return <HistoryIcon className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <HistoryIcon className="h-7 w-7 text-purple-500" />
            History Logs
          </h1>
          <p className="text-slate-400 mt-1">
            Review your past AI inquiries, corrections, formulas, and conversation logs.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 hover:bg-red-500/20 active:scale-95 transition-all shadow"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear All History
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search within prompts, titles, or answers..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <select
          value={toolFilter}
          onChange={(e) => setToolFilter(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-sm text-slate-300 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
        >
          <option value="all">All Tools</option>
          <option value="grammar">Grammar Fixer</option>
          <option value="math">Math Explainer</option>
          <option value="summary">Notes Summarizer</option>
          <option value="chat">AI Tutor Chat</option>
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Logs View List */}
      <div className="space-y-4">
        {isPending && logs.length === 0 ? (
          // Shimmer loader list
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-900/40 border border-slate-800/50" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
            <HistoryIcon className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-300">No logs found</h3>
            <p className="text-slate-500 text-sm mt-1">
              Your inquiries or searches didn't return any saved interactions.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const isExpanded = expandedId === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                    isExpanded
                      ? "border-purple-500/30 bg-slate-900/60 shadow-lg"
                      : "border-slate-800/80 bg-slate-900/20 hover:bg-slate-900/40"
                  }`}
                >
                  {/* Collapsed Header Info */}
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        {getToolIcon(log.toolType)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-md">
                          {log.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.createdAt).toLocaleDateString()} at{" "}
                          {new Date(log.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleDelete(log.id, e)}
                        className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/20 active:scale-90 transition-all"
                        title="Delete log"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Prompt & Response Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="border-t border-slate-800/80 bg-slate-950/40"
                      >
                        <div className="p-5 space-y-4 text-sm">
                          {/* User Prompt */}
                          <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                              Your Prompt
                            </span>
                            <div className="text-slate-300 whitespace-pre-wrap bg-slate-950/60 p-3 rounded-lg border border-slate-900/60 font-mono text-xs">
                              {log.prompt}
                            </div>
                          </div>

                          {/* AI Response */}
                          <div>
                            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
                              Tutor Response
                            </span>
                            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40">
                              {log.toolType === "math" ? (
                                <MathRenderer content={log.response} />
                              ) : (
                                <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                                  {log.response}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
