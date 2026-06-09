"use server";

import { connectToDatabase } from "@/lib/db";
import { getSessionUser } from "@/lib/jwt";
import History from "@/models/History";
import { revalidatePath } from "next/cache";

export async function getHistoryAction(search?: string, toolFilter?: string) {
  const session = await getSessionUser();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await connectToDatabase();

    const query: any = { userId: session.userId };

    if (toolFilter && toolFilter !== "all") {
      query.toolType = toolFilter;
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: regex },
        { prompt: regex },
        { response: regex },
      ];
    }

    const logs = await History.find(query).sort({ createdAt: -1 });

    return {
      success: true,
      logs: logs.map((log) => ({
        id: log._id.toString(),
        toolType: log.toolType,
        title: log.title,
        prompt: log.prompt,
        response: log.response,
        createdAt: log.createdAt.toISOString(),
      })),
    };
  } catch (error: any) {
    console.error("Error retrieving history:", error);
    return { error: "Failed to retrieve history logs" };
  }
}

export async function deleteHistoryItemAction(itemId: string) {
  const session = await getSessionUser();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await connectToDatabase();

    const deleted = await History.findOneAndDelete({
      _id: itemId,
      userId: session.userId,
    });

    if (!deleted) {
      return { error: "Item not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/history");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting history item:", error);
    return { error: "Failed to delete item" };
  }
}

export async function clearAllHistoryAction() {
  const session = await getSessionUser();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await connectToDatabase();

    await History.deleteMany({ userId: session.userId });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/history");

    return { success: true };
  } catch (error: any) {
    console.error("Error clearing history:", error);
    return { error: "Failed to clear history" };
  }
}
