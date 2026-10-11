import { NextRequest, NextResponse } from "next/server";
import {
  getPartiesFromDb,
  savePartyToDb,
  deletePartyFromDb,
  clearAllPartiesFromDb,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase().trim();

    const parties = await getPartiesFromDb();

    if (!query) {
      return NextResponse.json({ success: true, parties });
    }

    // Search by primary guest, party name, or members
    const matches = parties.filter((p: any) => {
      if (p.primaryGuest?.toLowerCase().includes(query)) return true;
      if (p.partyName?.toLowerCase().includes(query)) return true;
      if (Array.isArray(p.members)) {
        return p.members.some((m: any) =>
          m.name?.toLowerCase().includes(query)
        );
      }
      return false;
    });

    return NextResponse.json({ success: true, parties: matches });
  } catch (error: any) {
    console.error("GET /api/guests error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve guest list", parties: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support bulk batch save (e.g. from Excel/CSV import)
    if (Array.isArray(body.parties)) {
      for (const p of body.parties) {
        await savePartyToDb({
          id: p.id || "pty-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
          partyName: p.partyName,
          primaryGuest: p.primaryGuest,
          email: p.email,
          phone: p.phone,
          maxSeats: p.maxSeats || (p.members ? p.members.length : 1),
          members: p.members || [],
          tableNumber: p.tableNumber,
          status: p.status || "pending",
          notes: p.notes,
          lastUpdated: new Date().toLocaleString(),
        });
      }
      const all = await getPartiesFromDb();
      return NextResponse.json({ success: true, parties: all });
    }

    const {
      id,
      partyName,
      primaryGuest,
      email,
      phone,
      maxSeats,
      members,
      tableNumber,
      status,
      notes,
    } = body;

    if (!primaryGuest || !partyName) {
      return NextResponse.json(
        { success: false, error: "Primary guest and party name are required" },
        { status: 400 }
      );
    }

    const partyId = id || "pty-" + Date.now();
    const partyData = {
      id: partyId,
      partyName,
      primaryGuest,
      email: email || "",
      phone: phone || "",
      maxSeats: maxSeats || (members ? members.length : 1),
      members: members || [
        {
          id: "m-" + Date.now() + "-1",
          name: primaryGuest,
          role: "Primary Guest",
          isAttending: true,
        },
      ],
      tableNumber: tableNumber || "",
      status: status || "pending",
      notes: notes || "",
      lastUpdated: new Date().toLocaleString(),
    };

    await savePartyToDb(partyData);
    return NextResponse.json({ success: true, party: partyData });
  } catch (error: any) {
    console.error("POST /api/guests error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save party" },
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
      await clearAllPartiesFromDb();
      return NextResponse.json({ success: true, message: "All parties cleared" });
    }

    if (id) {
      await deletePartyFromDb(id);
      return NextResponse.json({ success: true, deletedId: id });
    }

    // Try reading JSON body if available
    try {
      const body = await request.json();
      if (Array.isArray(body.ids)) {
        for (const item of body.ids) {
          await deletePartyFromDb(item);
        }
        return NextResponse.json({ success: true, deletedIds: body.ids });
      }
    } catch {
      // ignore
    }

    return NextResponse.json(
      { success: false, error: "ID or clearAll required" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("DELETE /api/guests error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete party" },
      { status: 500 }
    );
  }
}
