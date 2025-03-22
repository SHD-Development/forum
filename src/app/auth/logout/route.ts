import { signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await signOut({ redirectTo: "/auth/login" });
}
