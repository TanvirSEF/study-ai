"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/actions/auth";
import { Settings, LogOut, User, Shield, Moon, Eye } from "lucide-react";

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Settings className="h-7 w-7 text-slate-400" />
          Workspace Settings
        </h1>
        <p className="text-slate-400 mt-1">
          Manage your personal learning profile, interface theme, and session details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-purple-400" />
            Profile Information
          </h3>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                Plan Level
              </span>
              <span className="text-sm font-bold text-purple-400 flex items-center gap-1.5 mt-0.5">
                Free Tier
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                Daily Requests Quota
              </span>
              <span className="text-sm font-semibold text-slate-200 mt-0.5">
                20 Requests per day
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                Current Timezone
              </span>
              <span className="text-sm font-semibold text-slate-200 mt-0.5">
                Universal Time Coordinated (UTC)
              </span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-400" />
              Interface Option
            </h3>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <Moon className="h-5 w-5 text-purple-400" />
              <div className="text-left">
                <span className="text-xs font-semibold text-slate-500 block">
                  Theme mode
                </span>
                <span className="text-sm font-bold text-slate-200">
                  Midnight Slate (Dark)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-red-600/10 border border-red-500/20 font-semibold text-sm text-red-400 hover:bg-red-500/20 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <LogOut className="h-4.5 w-4.5" />
            {isPending ? "Logging out..." : "Log Out Session"}
          </button>
        </div>
      </div>
    </div>
  );
}
