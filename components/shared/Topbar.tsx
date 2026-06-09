"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/actions/auth";
import { LogOut, User, Menu } from "lucide-react";

interface TopbarProps {
  userName: string;
  userEmail: string;
}

export default function Topbar({ userName, userEmail }: TopbarProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/20 backdrop-blur-md flex items-center justify-between px-8 text-slate-100 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger could go here */}
        <h2 className="text-lg font-bold tracking-tight text-white">
          Workspace
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* User Info Card */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-sm font-semibold text-white leading-none">
              {userName}
            </span>
            <span className="text-xs text-slate-500 mt-1">
              {userEmail}
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-sm shadow-inner">
            {getInitials(userName)}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all text-slate-400 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
