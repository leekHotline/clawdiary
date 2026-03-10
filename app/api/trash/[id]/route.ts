import { NextResponse } from "next/server";
import { getTrashItem, permanentlyDelete } from "@/lib/trash";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await getTrashItem(id);
    if (!item) {
      return NextResponse.json({ error: "Trash item not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching trash item:", error);
    return NextResponse.json({ error: "Failed to fetch trash item" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await permanentlyDelete(id);
    if (!success) {
      return NextResponse.json({ error: "Trash item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error permanently deleting:", error);
    return NextResponse.json({ error: "Failed to permanently delete" }, { status: 500 });
  }
}