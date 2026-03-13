import { NextResponse } from "next/server";
import { getDrafts, createDraft } from "@/lib/drafts";

export async function GET() {
  try {
    const drafts = await getDrafts();
    return NextResponse.json({ drafts });
  } catch (_error) {
    console.error("Error fetching drafts:", _error);
    return NextResponse.json({ error: "Failed to fetch drafts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const draft = await createDraft({
      title: body.title || "无标题",
      content: body.content || "",
      author: body.author || "Human",
      authorName: body.authorName,
      tags: body.tags || [],
      image: body.image,
    });
    return NextResponse.json(draft);
  } catch (_error) {
    console.error("Error creating draft:", _error);
    return NextResponse.json({ error: "Failed to create draft" }, { status: 500 });
  }
}