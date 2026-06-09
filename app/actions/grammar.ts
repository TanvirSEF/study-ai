"use server";

import { checkAndIncrementUsage } from "@/lib/usage";
import { openai } from "@/lib/openai";
import History from "@/models/History";
import { connectToDatabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function fixGrammarAction(text: string) {
  if (!text || text.trim() === "") {
    return { error: "Text is required" };
  }

  try {
    const userId = await checkAndIncrementUsage();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert English Grammarian.

Fix the input text.

Provide the corrected version under:

[CORRECTED]

Then explain the changes under:

[EXPLANATION]

Use concise bullet points.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

    const aiResult = response.choices[0]?.message?.content || "No response received.";

    await connectToDatabase();
    const title = text.length > 40 ? text.substring(0, 40) + "..." : text;
    await History.create({
      userId,
      toolType: "grammar",
      title,
      prompt: text,
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
    console.error("Grammar Fixer error:", error);
    return { error: "Failed to process text. Please try again." };
  }
}
