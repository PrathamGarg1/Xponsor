// app/api/debug-token/route.js
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  const rawToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true, // 👈 This returns the actual JWT string
  });

  if (!rawToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  return new Response(JSON.stringify({ token: rawToken }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
