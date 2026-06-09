import { connectToDatabase } from "@/lib/db";
import { getSessionUser } from "@/lib/jwt";
import Usage from "@/models/Usage";

/**
 * Checks if the user is authenticated and has requests remaining for the day.
 * If yes, increments their request count and returns the userId.
 * If no, throws a 'limit_reached' or 'unauthorized' error.
 */
export async function checkAndIncrementUsage(): Promise<string> {
  const session = await getSessionUser();
  if (!session) {
    throw new Error("unauthorized");
  }

  await connectToDatabase();

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  let usage = await Usage.findOne({ userId: session.userId });

  if (!usage) {
    // If usage tracking doesn't exist yet, create it and register first request
    await Usage.create({
      userId: session.userId,
      totalRequests: 1,
      todayRequests: 1,
      lastRequestDate: todayStr,
    });
    return session.userId;
  }

  // Handle daily reset
  if (usage.lastRequestDate !== todayStr) {
    usage.todayRequests = 1;
    usage.totalRequests += 1;
    usage.lastRequestDate = todayStr;
    await usage.save();
    return session.userId;
  }

  // Verify daily limit
  if (usage.todayRequests >= 20) {
    throw new Error("limit_reached");
  }

  // Increment usage counts
  usage.todayRequests += 1;
  usage.totalRequests += 1;
  await usage.save();

  return session.userId;
}
