import { NextRequest, NextResponse } from "next/server";
import { weddingData } from "@/data/weddingData";

// In-memory server cache initialized with weddingData.invitedParties
let serverParties = [...weddingData.invitedParties];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase().trim();

  if (!query) {
    return NextResponse.json({ success: true, parties: serverParties });
  }

  // Search by primary guest, party name, or any accompanying member name
  const matches = serverParties.filter((party) => {
    if (party.primaryGuest.toLowerCase().includes(query)) return true;
    if (party.partyName.toLowerCase().includes(query)) return true;
    return party.members.some((m) => m.name.toLowerCase().includes(query));
  });

  return NextResponse.json({ success: true, parties: matches });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, partyName, primaryGuest, email, phone, maxSeats, members, tableNumber, notes } = body;

    if (!primaryGuest || !partyName) {
      return NextResponse.json(
        { success: false, error: "Primary guest and party name are required" },
        { status: 400 }
      );
    }

    if (id) {
      // Update existing
      serverParties = serverParties.map((p) =>
        p.id === id
          ? {
              ...p,
              partyName,
              primaryGuest,
              email: email || p.email,
              phone: phone || p.phone,
              maxSeats: maxSeats || p.maxSeats,
              members: members || p.members,
              tableNumber: tableNumber !== undefined ? tableNumber : p.tableNumber,
              notes: notes !== undefined ? notes : p.notes,
            }
          : p
      );
      const updated = serverParties.find((p) => p.id === id);
      return NextResponse.json({ success: true, party: updated });
    } else {
      // Create new
      const newParty = {
        id: "pty-" + Date.now(),
        partyName,
        primaryGuest,
        email: email || "",
        phone: phone || "",
        maxSeats: maxSeats || (members ? members.length : 1),
        members: members || [
          { id: "m-" + Date.now() + "-1", name: primaryGuest, role: "Primary Guest", isAttending: true },
        ],
        tableNumber: tableNumber || "",
        notes: notes || "",
      };
      serverParties = [newParty, ...serverParties];
      return NextResponse.json({ success: true, party: newParty });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
  }

  serverParties = serverParties.filter((p) => p.id !== id);
  return NextResponse.json({ success: true, deletedId: id });
}
