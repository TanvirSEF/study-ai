import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "next/navigation";
import QuickActions from "@/components/dashboard/QuickActions";
import { Sparkles, Calendar } from "lucide-react";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  // Get current date formatted nicely
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayFormatted = new Date().toLocaleDateString("en-US", options);

  return (
    <div className="space-y-8">
      {/* Welcome Message Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Study Workspace Active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back, {data.user.name}!
          </h1>
          <p className="text-slate-400 mt-1">
            Choose a tool below to begin your personalized learning session.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <Calendar className="h-4 w-4 text-purple-400" />
          <span>{todayFormatted}</span>
        </div>
      </div>

      {/* Grid of Action Cards */}
      <QuickActions />
    </div>
  );
}
