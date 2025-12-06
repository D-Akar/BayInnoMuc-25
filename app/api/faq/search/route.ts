import { NextRequest, NextResponse } from "next/server";
import { searchFAQs } from "@/lib/backend/faqService";

// TODO: Add rate limiting
// TODO: Implement vector database similarity search
// TODO: Add result ranking and relevance scoring
// TODO: Cache common search queries

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    const results = searchFAQs(query);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error searching FAQs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

