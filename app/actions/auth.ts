"use server";

import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Usage from "@/models/Usage";
import { signJWT, setSessionCookie, deleteSessionCookie } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signupAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Initialize daily request usage schema
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    await Usage.create({
      userId: newUser._id,
      totalRequests: 0,
      todayRequests: 0,
      lastRequestDate: todayStr,
    });

    const token = await signJWT({
      userId: newUser._id.toString(),
      email: newUser.email,
    });

    await setSessionCookie(token);
  } catch (error: any) {
    console.error("Signup error:", error);
    return { error: error.message || "Something went wrong" };
  }

  redirect("/dashboard");
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "All fields are required" };
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid email or password" };
    }

    const token = await signJWT({
      userId: user._id.toString(),
      email: user.email,
    });

    await setSessionCookie(token);
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: error.message || "Something went wrong" };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSessionCookie();
  redirect("/login");
}
