"use server";

import { connectToDatabase } from "@/lib/db";
import { getSessionUser } from "@/lib/jwt";
import User from "@/models/User";
import Usage from "@/models/Usage";

export async function getDashboardData() {
  const session = await getSessionUser();
  if (!session) {
    return null;
  }

  try {
    await connectToDatabase();

    const user = await User.findById(session.userId).select("name email");
    if (!user) {
      return null;
    }

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let usage = await Usage.findOne({ userId: session.userId });

    if (!usage) {
      usage = await Usage.create({
        userId: session.userId,
        totalRequests: 0,
        todayRequests: 0,
        lastRequestDate: todayStr,
      });
    } else if (usage.lastRequestDate !== todayStr) {
      usage.todayRequests = 0;
      usage.lastRequestDate = todayStr;
      await usage.save();
    }

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      usage: {
        todayRequests: usage.todayRequests,
        totalRequests: usage.totalRequests,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}
