import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || `http://${request.headers.get("host")}`;

  if (!code) {
    // If no code is found, redirect to the login page
    return NextResponse.redirect(new URL("/login", url));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Error exchanging code for session:", error.message);
    return NextResponse.redirect(new URL("/login", baseUrl));
  }

  // Login successful, redirect to the homepage
  return NextResponse.redirect(new URL("/", baseUrl));
}
