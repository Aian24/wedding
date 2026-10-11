import { NextRequest, NextResponse } from "next/server";
import { getConfig, saveConfig } from "@/lib/db";
import { getInitialThemeColors, ThemeColor } from "@/lib/weddingStore";

export async function GET() {
  try {
    const saved = await getConfig<ThemeColor[]>("theme_colors");
    const colors = saved || getInitialThemeColors();
    return NextResponse.json({
      success: true,
      colors,
    });
  } catch (error: any) {
    console.error("GET /api/theme error:", error);
    return NextResponse.json({
      success: false,
      colors: getInitialThemeColors(),
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (Array.isArray(body.colors)) {
      await saveConfig("theme_colors", body.colors);
      return NextResponse.json({ success: true, colors: body.colors });
    }

    const { name, hex, desc } = body;
    if (!name || !hex) {
      return NextResponse.json(
        { success: false, error: "Color name and HEX are required" },
        { status: 400 }
      );
    }

    const saved = await getConfig<ThemeColor[]>("theme_colors");
    const existing = saved || getInitialThemeColors();

    const newColor: ThemeColor = {
      id: "color-" + Date.now(),
      name,
      hex,
      desc: desc || "",
    };

    const updated = [...existing, newColor];
    await saveConfig("theme_colors", updated);

    return NextResponse.json({ success: true, color: newColor });
  } catch (error: any) {
    console.error("POST /api/theme error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update theme colors" },
      { status: 500 }
    );
  }
}
