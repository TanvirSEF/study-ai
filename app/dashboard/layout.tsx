import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "next/navigation";
import Sidebar from "@/components/shared/Sidebar";
import Topbar from "@/components/shared/Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar todayRequests={data.usage.todayRequests} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header */}
        <Topbar userName={data.user.name} userEmail={data.user.email} />

        {/* Dynamic Inner Page Content */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
