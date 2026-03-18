import { NextResponse } from "next/server";
import { getTrashItems, addToTrash } from "@/lib/trash";

export async function GET() {
  try {
    const items = await getTrashItems();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Failed to fetch trash items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await addToTrash(body.type, body.item);
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to add to trash" }, { status: 500 });
  }
}