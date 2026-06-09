"use server";

import { checkAndIncrementUsage } from "@/lib/usage";
import { openai } from "@/lib/openai";
import History from "@/models/History";
import { connectToDatabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function explainMathAction(problem: string) {
  if (!problem || problem.trim() === "") {
    return { error: "Math problem is required" };
  }

  try {
    const userId = await checkAndIncrementUsage();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert Math tutor. Solve the mathematical problem step-by-step.
You support Algebra, Arithmetic, Calculus, and General Mathematics.

CRITICAL: You must format math equations using LaTeX.
- Use block math notation with double dollar signs $$...$$ on a separate line for main equations and formulas.
- Use inline math notation with single dollar signs $...$ for variables, expressions, or math terms inside a sentence.

You must structure your response exactly in this format:

Step 1
Explanation of first step with equations...

Step 2
Explanation of second step with equations...

Step 3
Explanation of third step with equations...
(add more steps as needed)

Concept Note
(Simple high-level explanation of the concept used to solve the problem)`,
        },
        {
          role: "user",
          content: problem,
        },
      ],
      temperature: 0.2,
    });

    const aiResult = response.choices[0]?.message?.content || "No explanation received.";

    await connectToDatabase();
    const title = problem.length > 40 ? problem.substring(0, 40) + "..." : problem;
    await History.create({
      userId,
      toolType: "math",
      title,
      prompt: problem,
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
    console.error("Math Explainer error:", error);
    return { error: "Failed to process math problem. Please try again." };
  }
}
