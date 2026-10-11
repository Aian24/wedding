import { NextRequest, NextResponse } from "next/server";
import {
  getRsvpsFromDb,
  saveRsvpToDb,
  deleteRsvpFromDb,
  clearAllRsvpsFromDb,
} from "@/lib/db";

export async function GET() {
  try {
    const rsvps = await getRsvpsFromDb();
    return NextResponse.json({
      success: true,
      total: rsvps.length,
      rsvps,
    });
  } catch (error: any) {
    console.error("GET /api/rsvp error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve RSVPs", rsvps: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support bulk batch import (e.g. from Excel/CSV)
    if (Array.isArray(body.rsvps)) {
      for (const r of body.rsvps) {
        await saveRsvpToDb({
          id: r.id || "rsvp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
          partyId: r.partyId,
          fullName: r.fullName,
          email: r.email,
          phone: r.phone,
          status: r.status || "attending",
          guestCount: r.guestCount || 1,
          companionNames: r.companionNames || "",
          memberBreakdown: r.memberBreakdown || [],
          message: r.message || "",
          tableNumber: r.tableNumber || "Unassigned",
          submittedAt: r.submittedAt || new Date().toLocaleString(),
        });
      }
      const all = await getRsvpsFromDb();
      return NextResponse.json({ success: true, rsvps: all });
    }

    const {
      id,
      partyId,
      fullName,
      email,
      phone,
      status,
      guestCount,
      companionNames,
      memberBreakdown,
      message,
      tableNumber,
      submittedAt,
    } = body;

    if (!fullName) {
      return NextResponse.json(
        { success: false, error: "Guest full name is required" },
        { status: 400 }
      );
    }

    const newRsvp = {
      id: id || "rsvp-" + Date.now(),
      partyId: partyId || null,
      fullName,
      email: email || "",
      phone: phone || "",
      status: status || "attending",
      guestCount:
        guestCount ||
        (memberBreakdown && Array.isArray(memberBreakdown)
          ? memberBreakdown.filter((m: { isAttending: boolean }) => m.isAttending).length
          : 1),
      companionNames: companionNames || "",
      memberBreakdown: memberBreakdown || [],
      message: message || "",
      tableNumber: tableNumber || "Unassigned",
      submittedAt: submittedAt || new Date().toLocaleString(),
    };

    await saveRsvpToDb(newRsvp);

    return NextResponse.json({
      success: true,
      rsvp: newRsvp,
    });
  } catch (error: any) {
    console.error("POST /api/rsvp error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process RSVP submission" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "RSVP ID is required" },
        { status: 400 }
      );
    }

    const all = await getRsvpsFromDb();
    const existing = all.find((r: any) => r.id === id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "RSVP not found" },
        { status: 404 }
      );
    }

    const merged = { ...existing, ...updates };
    await saveRsvpToDb(merged);

    return NextResponse.json({ success: true, rsvp: merged });
  } catch (error: any) {
    console.error("PATCH /api/rsvp error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update RSVP" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clearAll");

    if (clearAll === "true") {
      await clearAllRsvpsFromDb();
      return NextResponse.json({ success: true, message: "All RSVPs cleared" });
    }

    if (id) {
      await deleteRsvpFromDb(id);
      return NextResponse.json({ success: true, deletedId: id });
    }

    return NextResponse.json(
      { success: false, error: "ID or clearAll required" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("DELETE /api/rsvp error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete RSVP" },
      { status: 500 }
    );
  }
}
