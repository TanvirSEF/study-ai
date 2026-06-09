"use server";

import { checkAndIncrementUsage } from "@/lib/usage";
import { openai } from "@/lib/openai";
import History from "@/models/History";
import { connectToDatabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function chatAction(chatHistory: { role: "user" | "assistant"; content: string }[], newMessage: string) {
  if (!newMessage || newMessage.trim() === "") {
    return { error: "Message is required" };
  }

  try {
    const userId = await checkAndIncrementUsage();

    const messages = [
      {
        role: "system",
        content: "You are a friendly, encouraging, and highly intelligent AI study tutor. Explain concepts clearly using examples, break down complex topics, and ask guiding questions to verify the student's understanding.",
      },
      ...chatHistory,
      { role: "user", content: newMessage },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as any,
      temperature: 0.7,
    });

    const aiResult = response.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

    await connectToDatabase();
    const title = newMessage.length > 40 ? newMessage.substring(0, 40) + "..." : newMessage;
    await History.create({
      userId,
      toolType: "chat",
      title,
      prompt: newMessage,
      response: aiResult,
    });

    revalidatePath("/dashboard");

    return { success: true, result: aiResult };
  } catch (error: any) {
    if (error.message === "limit_reached") {
      return { error: "Daily request limit of 20 reached. Resets tomorrow." };
    }
    if (error.message === "unauthorized") {
      return { error: "Unauthorized. Please log in." };
    }
    console.error("AI Tutor Chat error:", error);
    return { error: "Failed to communicate with AI. Please try again." };
  }
}
