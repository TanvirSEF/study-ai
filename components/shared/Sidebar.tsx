"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  LayoutDashboard,
  Pencil,
  Calculator,
  BookOpen,
  MessageSquare,
  History,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  todayRequests: number;
}

export default function Sidebar({ todayRequests }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Grammar Fixer", href: "/dashboard/grammar", icon: Pencil },
    { name: "Math Explainer", href: "/dashboard/math", icon: Calculator },
    { name: "Notes Summarizer", href: "/dashboard/summary", icon: BookOpen },
    { name: "AI Tutor Chat", href: "/dashboard/chat", icon: MessageSquare },
    { name: "History Logs", href: "/dashboard/history", icon: History },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const limit = 20;
  const percentage = Math.min((todayRequests / limit) * 100, 100);

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between h-screen sticky top-0 text-slate-300">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-white">
          <Brain className="h-6 w-6 text-purple-500 animate-pulse" />
          <span>Study<span className="text-purple-500">AI</span></span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-purple-600/10 text-purple-400 border-l-2 border-purple-500 pl-3.5"
                  : "hover:bg-slate-800/50 hover:text-slate-100"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Usage Widget */}
      <div className="p-4 border-t border-slate-800/80 m-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-slate-400 font-semibold">
            <Sparkles className="h-3 w-3 text-purple-400" />
            Daily Requests
          </span>
          <span className="font-mono text-slate-300 font-bold">
            {todayRequests} / {limit}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              percentage >= 90 ? "bg-red-500" : percentage >= 70 ? "bg-amber-500" : "bg-purple-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 text-center">
          Resets daily at midnight UTC
        </p>
      </div>
    </aside>
  );
}
