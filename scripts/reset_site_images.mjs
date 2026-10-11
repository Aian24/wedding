import { neon } from "@neondatabase/serverless";

const connectionString = "postgresql://neondb_owner:npg_b01PEyMFgKQu@ep-super-cake-b4s0p24b-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(connectionString);

const defaultImages = {
  logo: "/images/wedding-logo.png",
  heroPoster: "/images/hero.jpg",
  heroVideo: "/hero-video.mp4",
  invitationVideo: "/invitation.mp4",
  ceremonyVenue: "/images/ceremony.jpg",
  receptionVenue: "/images/reception.jpg",
  ladiesAttire: "/images/sample-dress-ladies.jpg",
  menAttire: "/images/sample-attire-men.jpg",
  envelopeCover: "/images/envelope-cover.jpg",
  floralCorner: "/images/floral-corner.jpg",
  floralDivider: "/images/floral-divider.jpg",
};

async function main() {
  await sql`
    INSERT INTO wedding_config (key, data, updated_at)
    VALUES ('site_images', ${JSON.stringify(defaultImages)}::jsonb, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `;
  console.log("Successfully reset site_images in Neon database to defaults!");
}

main().catch(console.error);
