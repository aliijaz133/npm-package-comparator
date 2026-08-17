import { NextRequest, NextResponse } from "next/server";
import { fetchSuggestions } from "@/lib/npms";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const suggestions = await fetchSuggestions(query);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Search suggestions failed:", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 502 });
  }
}
