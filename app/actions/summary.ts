"use server";

import { checkAndIncrementUsage } from "@/lib/usage";
import { openai } from "@/lib/openai";
import History from "@/models/History";
import { connectToDatabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function summarizeAction(notes: string) {
  if (!notes || notes.trim() === "") {
    return { error: "Notes text is required" };
  }

  // Word count check
  const words = notes.trim().split(/\s+/);
  if (words.length > 2000) {
    return { error: `Notes exceed the maximum limit of 2,000 words (Current: ${words.length} words)` };
  }

  try {
    const userId = await checkAndIncrementUsage();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert educational summarizer.
Summarize the input text. You must return your response structured exactly under these three sections:

[SHORT SUMMARY]
Provide a concise 2-3 line overview of the text.

[KEY BULLET POINTS]
Provide the main concepts and important points as bullet points.

[EXAM TIPS]
Provide exam-focused key takeaways, facts, or revision hints that students should memorize.`,
        },
        {
          role: "user",
          content: notes,
        },
      ],
      temperature: 0.3,
    });

    const aiResult = response.choices[0]?.message?.content || "No summary received.";

    await connectToDatabase();
    const title = notes.length > 40 ? notes.substring(0, 40) + "..." : notes;
    await History.create({
      userId,
      toolType: "summary",
      title,
      prompt: notes,
      response: aiResult,
    });

    revalidatePath("/dashboard");

    return { success: true, result: aiResult };
  } catch (error: any) {
    if (error.message === "limit_reached") {
      return { error: "Daily request limit of 20 reached. Resets tomorrow." };
    }
    if (error.message === "unauthorized") {
      return { error: "Unauthorized access. Please log in." };
    }
    console.error("Notes Summarizer error:", error);
    return { error: "Failed to summarize. Please try again." };
  }
}
