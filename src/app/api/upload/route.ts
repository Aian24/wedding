import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const maxDuration = 120; // 2 minutes for mobile video uploads

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const key = (formData.get("key") as string) || "asset";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine extension
    const originalExt = path.extname(file.name) || "";
    const lowerExt = originalExt.toLowerCase();
    const allowedExts = [
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
      ".svg",
      ".gif",
      ".mp4",
      ".webm",
      ".mov",
      ".m4v",
      ".ogg",
      ".heic",
      ".heif",
    ];

    let safeExt = allowedExts.includes(lowerExt) ? lowerExt : "";
    if (!safeExt) {
      if (file.type.startsWith("video/") || file.type === "video/quicktime") {
        safeExt = lowerExt === ".mov" ? ".mov" : ".mp4";
      } else if (file.type === "image/png") {
        safeExt = ".png";
      } else if (file.type === "image/webp") {
        safeExt = ".webp";
      } else {
        safeExt = ".jpg";
      }
    }

    // Try writing to public/uploads (local development or persistent filesystem)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${key}-${Date.now()}${safeExt}`;
      const filePath = path.join(uploadsDir, fileName);

      await fs.promises.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${fileName}`;
      return NextResponse.json({ success: true, url: publicUrl });
    } catch (fsError: any) {
      // In serverless environments (Vercel), local filesystem is read-only.
      // If buffer is under 4MB, gracefully return base64 data URI.
      if (buffer.length <= 4 * 1024 * 1024) {
        const mime =
          file.type ||
          (safeExt === ".png"
            ? "image/png"
            : safeExt === ".webp"
            ? "image/webp"
            : safeExt === ".mov"
            ? "video/quicktime"
            : safeExt === ".mp4"
            ? "video/mp4"
            : "image/jpeg");
        const base64 = buffer.toString("base64");
        const dataUri = `data:${mime};base64,${base64}`;
        return NextResponse.json({ success: true, url: dataUri });
      }

      return NextResponse.json(
        { error: "File exceeds serverless memory limit. Please upload a file under 4 MB or configure cloud storage." },
        { status: 413 }
      );
    }
  } catch (error: any) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file to server" },
      { status: 500 }
    );
  }
}
