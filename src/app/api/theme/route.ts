import { NextRequest, NextResponse } from "next/server";
import { getInitialThemeColors, ThemeColor } from "@/lib/weddingStore";

let serverColors: ThemeColor[] = getInitialThemeColors();

export async function GET() {
  return NextResponse.json({
    success: true,
    colors: serverColors,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (Array.isArray(body.colors)) {
      serverColors = body.colors;
      return NextResponse.json({ success: true, colors: serverColors });
    }

    const { name, hex, desc } = body;
    if (!name || !hex) {
      return NextResponse.json(
        { success: false, error: "Color name and HEX are required" },
        { status: 400 }
      );
    }

    const newColor: ThemeColor = {
      id: "color-" + Date.now(),
      name,
      hex,
      desc: desc || "",
    };

    serverColors = [...serverColors, newColor];
    return NextResponse.json({ success: true, color: newColor });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update theme colors" },
      { status: 500 }
    );
  }
}
