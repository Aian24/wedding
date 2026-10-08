import { NextRequest, NextResponse } from "next/server";
import { getInitialRsvps, RsvpEntry } from "@/lib/weddingStore";

let serverRsvps: RsvpEntry[] = getInitialRsvps();

export async function GET() {
  return NextResponse.json({
    success: true,
    total: serverRsvps.length,
    rsvps: serverRsvps,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partyId, fullName, email, phone, status, guestCount, companionNames, memberBreakdown, message, tableNumber } = body;

    if (!fullName) {
      return NextResponse.json(
        { success: false, error: "Guest full name is required" },
        { status: 400 }
      );
    }

    const newRsvp: RsvpEntry = {
      id: "rsvp-" + Date.now(),
      partyId,
      fullName,
      email: email || "",
      phone: phone || "",
      status: status || "attending",
      guestCount: guestCount || (memberBreakdown ? memberBreakdown.filter((m: { isAttending: boolean }) => m.isAttending).length : 1),
      companionNames: companionNames || "",
      memberBreakdown: memberBreakdown || [],
      message: message || "",
      tableNumber: tableNumber || "Unassigned",
      submittedAt: new Date().toLocaleString(),
    };

    serverRsvps = [newRsvp, ...serverRsvps];

    return NextResponse.json({
      success: true,
      rsvp: newRsvp,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process RSVP submission" },
      { status: 500 }
    );
  }
}
