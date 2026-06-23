import { NextResponse } from "next/server";

function getAdminEmails() {
  return (process.env.FOODMOOD_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!supabaseUrl || !anonKey || !token) {
    return NextResponse.json({ error: "Auth no configurado" }, { status: 401 });
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Sesion invalida" }, { status: 401 });
  }

  const user = await response.json() as {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string; name?: string; avatar_url?: string };
  };
  const email = user.email?.toLowerCase() ?? "";
  const role = email && getAdminEmails().includes(email) ? "admin" : "user";

  return NextResponse.json({
    user: {
      id: user.id,
      email,
      name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? email.split("@")[0] ?? "Usuario",
      avatarUrl: user.user_metadata?.avatar_url,
      role,
    },
  });
}
