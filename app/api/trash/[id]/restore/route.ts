import { NextResponse } from "next/server";
import { restoreFromTrash } from "@/lib/trash";
import { createDiary, getDiaries } from "@/lib/diaries";
import { createDraft } from "@/lib/drafts";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await restoreFromTrash(id);
    
    if (!result) {
      return NextResponse.json({ error: "Trash item not found" }, { status: 404 });
    }

    const { type, data } = result;

    if (type === "diary") {
      // 恢复日记
      await createDiary({
        title: data.title,
        content: data.content,
        author: data.author,
        authorName: data.authorName,
        tags: data.tags,
        image: data.image,
        date: data.originalDate || new Date().toISOString().split("T")[0],
      });
    } else {
      // 恢复草稿
      await createDraft({
        title: data.title,
        content: data.content,
        author: data.author,
        authorName: data.authorName,
        tags: data.tags,
        image: data.image,
      });
    }

    return NextResponse.json({ success: true, type });
  } catch (error) {
    console.error("Error restoring from trash:", error);
    return NextResponse.json({ error: "Failed to restore from trash" }, { status: 500 });
  }
}