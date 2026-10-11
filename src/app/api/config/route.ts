import { NextRequest, NextResponse } from "next/server";
import { getConfig, saveConfig, getAllConfigs } from "@/lib/db";
import {
  getInitialCoupleInfo,
  getInitialThemeColors,
  getInitialEntourage,
  getInitialSiteImages,
} from "@/lib/weddingStore";

export async function GET() {
  try {
    const configs = await getAllConfigs();

    // Default fallbacks if DB doesn't have them yet
    const coupleInfo = configs.couple_info || getInitialCoupleInfo();
    const themeColors = configs.theme_colors || getInitialThemeColors();
    const entourage = configs.entourage || getInitialEntourage();
    const siteImages = configs.site_images || getInitialSiteImages();

    // If any config is missing from the DB, seed it in the background
    if (!configs.couple_info) {
      saveConfig("couple_info", coupleInfo).catch(console.error);
    }
    if (!configs.theme_colors) {
      saveConfig("theme_colors", themeColors).catch(console.error);
    }
    if (!configs.entourage) {
      saveConfig("entourage", entourage).catch(console.error);
    }
    if (!configs.site_images) {
      saveConfig("site_images", siteImages).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      coupleInfo,
      themeColors,
      entourage,
      siteImages,
    });
  } catch (error: any) {
    console.error("GET /api/config error:", error);
    // Return defaults safely if DB is unreachable
    return NextResponse.json({
      success: false,
      error: error.message,
      coupleInfo: getInitialCoupleInfo(),
      themeColors: getInitialThemeColors(),
      entourage: getInitialEntourage(),
      siteImages: getInitialSiteImages(),
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, data } = body;

    if (!key || data === undefined) {
      return NextResponse.json(
        { success: false, error: "Both key and data are required" },
        { status: 400 }
      );
    }

    await saveConfig(key, data);
    return NextResponse.json({ success: true, key });
  } catch (error: any) {
    console.error("POST /api/config error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update configuration" },
      { status: 500 }
    );
  }
}
