import { neon } from "@neondatabase/serverless";

export const NEON_CONNECTION_STRING =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_b01PEyMFgKQu@ep-super-cake-b4s0p24b-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const sql = neon(NEON_CONNECTION_STRING);

let isInitialized = false;

/**
 * Automatically creates all tables in Neon PostgreSQL if they do not exist.
 */
export async function ensureTables() {
  if (isInitialized) return;
  try {
    // 1. Config Table (stores coupleInfo, themeColors, entourage, siteImages, registry)
    await sql`
      CREATE TABLE IF NOT EXISTS wedding_config (
        key VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Parties Table (Master Guest List & household parties)
    await sql`
      CREATE TABLE IF NOT EXISTS parties (
        id VARCHAR(64) PRIMARY KEY,
        party_name TEXT NOT NULL,
        primary_guest TEXT NOT NULL,
        email TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        max_seats INTEGER DEFAULT 1,
        members JSONB DEFAULT '[]'::jsonb,
        table_number TEXT DEFAULT '',
        status TEXT DEFAULT 'pending',
        notes TEXT DEFAULT '',
        last_updated TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. RSVPs Table (Guest RSVP responses)
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id VARCHAR(64) PRIMARY KEY,
        party_id VARCHAR(64),
        full_name TEXT NOT NULL,
        email TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        status TEXT DEFAULT 'attending',
        guest_count INTEGER DEFAULT 1,
        companion_names TEXT DEFAULT '',
        member_breakdown JSONB DEFAULT '[]'::jsonb,
        message TEXT DEFAULT '',
        table_number TEXT DEFAULT 'Unassigned',
        submitted_at TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Guestbook Wishes Table
    await sql`
      CREATE TABLE IF NOT EXISTS guestbook_wishes (
        id VARCHAR(64) PRIMARY KEY,
        name TEXT NOT NULL,
        relationship TEXT DEFAULT '',
        message TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        date TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    isInitialized = true;
  } catch (err) {
    console.error("Failed to initialize database tables:", err);
    throw err;
  }
}

/**
 * Config Helpers
 */
export async function getConfig<T = any>(key: string): Promise<T | null> {
  await ensureTables();
  const rows = await sql`SELECT data FROM wedding_config WHERE key = ${key}`;
  if (rows.length === 0) return null;
  return rows[0].data as T;
}

export async function saveConfig(key: string, data: any) {
  await ensureTables();
  await sql`
    INSERT INTO wedding_config (key, data, updated_at)
    VALUES (${key}, ${JSON.stringify(data)}::jsonb, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `;
}

export async function getAllConfigs() {
  await ensureTables();
  const rows = await sql`SELECT key, data FROM wedding_config`;
  const result: Record<string, any> = {};
  for (const row of rows) {
    result[row.key] = row.data;
  }
  return result;
}

/**
 * Party Helpers
 */
export async function getPartiesFromDb() {
  await ensureTables();
  const rows = await sql`
    SELECT id, party_name as "partyName", primary_guest as "primaryGuest",
           email, phone, max_seats as "maxSeats", members,
           table_number as "tableNumber", status, notes,
           last_updated as "lastUpdated"
    FROM parties
    ORDER BY created_at DESC;
  `;
  return rows;
}

export async function savePartyToDb(party: {
  id: string;
  partyName: string;
  primaryGuest: string;
  email?: string;
  phone?: string;
  maxSeats: number;
  members: any[];
  tableNumber?: string;
  status?: string;
  notes?: string;
  lastUpdated?: string;
}) {
  await ensureTables();
  await sql`
    INSERT INTO parties (
      id, party_name, primary_guest, email, phone, max_seats,
      members, table_number, status, notes, last_updated
    )
    VALUES (
      ${party.id}, ${party.partyName}, ${party.primaryGuest},
      ${party.email || ""}, ${party.phone || ""}, ${party.maxSeats || 1},
      ${JSON.stringify(party.members || [])}::jsonb,
      ${party.tableNumber || ""}, ${party.status || "pending"},
      ${party.notes || ""}, ${party.lastUpdated || new Date().toLocaleString()}
    )
    ON CONFLICT (id) DO UPDATE SET
      party_name = EXCLUDED.party_name,
      primary_guest = EXCLUDED.primary_guest,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      max_seats = EXCLUDED.max_seats,
      members = EXCLUDED.members,
      table_number = EXCLUDED.table_number,
      status = EXCLUDED.status,
      notes = EXCLUDED.notes,
      last_updated = EXCLUDED.last_updated;
  `;
}

export async function deletePartyFromDb(id: string) {
  await ensureTables();
  await sql`DELETE FROM parties WHERE id = ${id}`;
}

export async function clearAllPartiesFromDb() {
  await ensureTables();
  await sql`DELETE FROM parties`;
}

/**
 * RSVP Helpers
 */
export async function getRsvpsFromDb() {
  await ensureTables();
  const rows = await sql`
    SELECT id, party_id as "partyId", full_name as "fullName",
           email, phone, status, guest_count as "guestCount",
           companion_names as "companionNames", member_breakdown as "memberBreakdown",
           message, table_number as "tableNumber", submitted_at as "submittedAt"
    FROM rsvps
    ORDER BY created_at DESC;
  `;
  return rows;
}

export async function saveRsvpToDb(rsvp: {
  id: string;
  partyId?: string;
  fullName: string;
  email?: string;
  phone?: string;
  status?: string;
  guestCount?: number;
  companionNames?: string;
  memberBreakdown?: any[];
  message?: string;
  tableNumber?: string;
  submittedAt?: string;
}) {
  await ensureTables();
  await sql`
    INSERT INTO rsvps (
      id, party_id, full_name, email, phone, status, guest_count,
      companion_names, member_breakdown, message, table_number, submitted_at
    )
    VALUES (
      ${rsvp.id}, ${rsvp.partyId || null}, ${rsvp.fullName},
      ${rsvp.email || ""}, ${rsvp.phone || ""}, ${rsvp.status || "attending"},
      ${rsvp.guestCount || 1}, ${rsvp.companionNames || ""},
      ${JSON.stringify(rsvp.memberBreakdown || [])}::jsonb,
      ${rsvp.message || ""}, ${rsvp.tableNumber || "Unassigned"},
      ${rsvp.submittedAt || new Date().toLocaleString()}
    )
    ON CONFLICT (id) DO UPDATE SET
      party_id = EXCLUDED.party_id,
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      status = EXCLUDED.status,
      guest_count = EXCLUDED.guest_count,
      companion_names = EXCLUDED.companion_names,
      member_breakdown = EXCLUDED.member_breakdown,
      message = EXCLUDED.message,
      table_number = EXCLUDED.table_number,
      submitted_at = EXCLUDED.submitted_at;
  `;
}

export async function deleteRsvpFromDb(id: string) {
  await ensureTables();
  await sql`DELETE FROM rsvps WHERE id = ${id}`;
}

export async function clearAllRsvpsFromDb() {
  await ensureTables();
  await sql`DELETE FROM rsvps`;
}

/**
 * Wishes Helpers
 */
export async function getWishesFromDb() {
  await ensureTables();
  const rows = await sql`
    SELECT id, name, relationship, message, likes, date, created_at
    FROM guestbook_wishes
    ORDER BY created_at DESC;
  `;
  return rows;
}

export async function saveWishToDb(wish: {
  id: string;
  name: string;
  relationship?: string;
  message: string;
  likes?: number;
  date?: string;
}) {
  await ensureTables();
  const dateVal =
    wish.date && wish.date !== "Just now"
      ? wish.date
      : new Date().toISOString();
  await sql`
    INSERT INTO guestbook_wishes (id, name, relationship, message, likes, date)
    VALUES (
      ${wish.id}, ${wish.name}, ${wish.relationship || "Cherished Guest"},
      ${wish.message}, ${wish.likes || 1}, ${dateVal}
    )
    ON CONFLICT (id) DO UPDATE SET
      likes = EXCLUDED.likes,
      message = EXCLUDED.message;
  `;
}

export async function likeWishInDb(id: string) {
  await ensureTables();
  await sql`
    UPDATE guestbook_wishes
    SET likes = likes + 1
    WHERE id = ${id};
  `;
}

export async function deleteWishFromDb(id: string) {
  await ensureTables();
  await sql`DELETE FROM guestbook_wishes WHERE id = ${id}`;
}
