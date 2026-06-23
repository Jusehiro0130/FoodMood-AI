import { NextResponse } from "next/server";

type FoodMoodRole = "user" | "admin";

type FoodMoodSessionUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: FoodMoodRole;
};

function getAdminEmails() {
  return (process.env.FOODMOOD_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function getStoredFoodMoodRole(input: { supabaseUrl: string; anonKey: string; userToken: string; userId: string }) {
  const url = new URL(`${input.supabaseUrl.replace(/\/$/, "")}/rest/v1/foodmood_users`);
  url.searchParams.set("id", `eq.${input.userId}`);
  url.searchParams.set("select", "role");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      apikey: input.anonKey,
      authorization: `Bearer ${input.userToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;
  const rows = await response.json() as Array<{ role?: FoodMoodRole }>;
  return rows[0]?.role ?? null;
}

async function rememberFoodMoodUser(input: {
  supabaseUrl: string;
  anonKey: string;
  userToken: string;
  serviceRoleKey?: string;
  user: FoodMoodSessionUser;
}) {
  const key = input.serviceRoleKey ?? input.anonKey;
  const token = input.serviceRoleKey ?? input.userToken;
  const response = await fetch(`${input.supabaseUrl.replace(/\/$/, "")}/rest/v1/foodmood_users`, {
    method: "POST",
    headers: {
      apikey: key,
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      id: input.user.id,
      email: input.user.email,
      name: input.user.name,
      avatar_url: input.user.avatarUrl,
      role: input.user.role,
      provider: "google",
      last_login_at: new Date().toISOString(),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Could not remember FoodMood user", await response.text());
  }
}

export async function GET(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
  const storedRole = await getStoredFoodMoodRole({ supabaseUrl, anonKey, userToken: token, userId: user.id });
  const role: FoodMoodRole = email && (getAdminEmails().includes(email) || storedRole === "admin") ? "admin" : "user";
  const appUser: FoodMoodSessionUser = {
    id: user.id,
    email,
    name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? email.split("@")[0] ?? "Usuario",
    avatarUrl: user.user_metadata?.avatar_url,
    role,
  };

  if (email) {
    await rememberFoodMoodUser({
      supabaseUrl,
      anonKey,
      serviceRoleKey,
      userToken: token,
      user: appUser,
    });
  }

  return NextResponse.json({
    user: appUser,
  });
}
