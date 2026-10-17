import { NextRequest, NextResponse } from "next/server";
import {
  getWishesFromDb,
  saveWishToDb,
  likeWishInDb,
  deleteWishFromDb,
} from "@/lib/db";

export async function GET() {
  try {
    const wishes = await getWishesFromDb();
    return NextResponse.json({
      success: true,
      total: wishes.length,
      wishes,
    });
  } catch (error: any) {
    console.error("GET /api/wishes error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve wishes", wishes: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Like action
    if (body.action === "like" && body.id) {
      await likeWishInDb(body.id);
      return NextResponse.json({ success: true, likedId: body.id });
    }

    const { name, relationship, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: "Name and message are required" },
        { status: 400 }
      );
    }

    const newWish = {
      id: "w-" + Date.now(),
      name: name.trim(),
      relationship: (relationship && relationship.trim()) || "Cherished Guest",
      message: message.trim(),
      likes: 1,
      date: new Date().toISOString(),
    };

    await saveWishToDb(newWish);

    return NextResponse.json({
      success: true,
      wish: newWish,
    });
  } catch (error: any) {
    console.error("POST /api/wishes error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to post wish" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Wish ID required" }, { status: 400 });
    }

    await deleteWishFromDb(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error("DELETE /api/wishes error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete wish" },
      { status: 500 }
    );
  }
}
