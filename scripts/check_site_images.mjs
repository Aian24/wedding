import { neon } from "@neondatabase/serverless";

const connectionString = "postgresql://neondb_owner:npg_b01PEyMFgKQu@ep-super-cake-b4s0p24b-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(connectionString);

async function check() {
  const rows = await sql`SELECT key, data, updated_at FROM wedding_config WHERE key = 'site_images'`;
  if (rows.length > 0) {
    console.log("Updated at:", rows[0].updated_at);
    console.log("Data keys:", Object.keys(rows[0].data));
    for (const [k, v] of Object.entries(rows[0].data)) {
      const valStr = String(v);
      console.log(`${k}: ${valStr.slice(0, 80)} (length: ${valStr.length})`);
    }
  } else {
    console.log("No site_images found in Neon.");
  }
}

check().catch(console.error);
