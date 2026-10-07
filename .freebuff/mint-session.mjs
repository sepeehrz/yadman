import fs from "node:fs";
import jwt from "jsonwebtoken";

const env = fs.readFileSync(".env", "utf8");
const databaseUrl = env.match(/DATABASE_URL="([^"]+)"/)?.[1];
const secret = env.match(/JWT_SECRET="([^"]+)"/)?.[1];
if (!databaseUrl || !secret) throw new Error("missing env values");

const { neon } = await import("@neondatabase/serverless");
const sql = neon(databaseUrl);
const rows = await sql`select id, username from users order by created_at limit 1`;
if (rows.length === 0) {
  console.log(JSON.stringify({ error: "no-users" }));
  process.exit(0);
}
const { id, username } = rows[0];
const ttl = 30 * 24 * 60 * 60;
const token = jwt.sign({ username }, secret, {
  subject: id,
  expiresIn: ttl,
});
const exp = new Date(Date.now() + ttl * 1000).toISOString();
console.log(JSON.stringify({ username, token, exp }));
