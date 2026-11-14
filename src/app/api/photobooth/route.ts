import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  getPhotoboothPhotosFromDb,
  savePhotoboothPhotoToDb,
  deletePhotoboothPhotoFromDb,
  PhotoboothPhoto,
} from "@/lib/db";

export const maxDuration = 60;

export async function GET() {
  try {
    const photos = await getPhotoboothPhotosFromDb();
    return NextResponse.json({ success: true, photos });
  } catch (error: any) {
    console.error("GET /api/photobooth error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch photos", photos: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      photoStripData, // base64 data url e.g. "data:image/png;base64,..."
      guestName,
      individualShots,
      frameTheme,
      filterApplied,
      notes,
    } = body;

    if (!photoStripData) {
      return NextResponse.json(
        { success: false, error: "Photo strip image data is required" },
        { status: 400 }
      );
    }

    const id = `pb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let publicUrl = photoStripData;

    // Attempt saving to local filesystem if available (e.g. localhost/server)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "photobooth");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const matches = photoStripData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], "base64");
        const fileName = `${id}.png`;
        const filePath = path.join(uploadsDir, fileName);
        await fs.promises.writeFile(filePath, buffer);
        publicUrl = `/uploads/photobooth/${fileName}`;
      }
    } catch (fsErr) {
      // In serverless / read-only filesystems (Vercel), store base64 data URL directly
      console.log("Local filesystem write skipped; using base64 storage:", fsErr);
    }

    const newPhoto: PhotoboothPhoto = {
      id,
      guest_name: guestName ? guestName.trim() : "Cherished Guest",
      photo_strip_url: publicUrl,
      individual_shots: Array.isArray(individualShots) ? individualShots : [],
      frame_theme: frameTheme || "classic-white",
      filter_applied: filterApplied || "natural",
      notes: notes ? notes.trim() : "",
      created_at: new Date().toISOString(),
    };

    await savePhotoboothPhotoToDb(newPhoto);

    return NextResponse.json({ success: true, photo: newPhoto });
  } catch (error: any) {
    console.error("POST /api/photobooth error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save photobooth photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Photo ID is required" },
        { status: 400 }
      );
    }

    await deletePhotoboothPhotoFromDb(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("DELETE /api/photobooth error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete photobooth photo" },
      { status: 500 }
    );
  }
}
