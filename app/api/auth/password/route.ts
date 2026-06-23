import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return NextResponse.json({ error: "Auth no configurado" }, { status: 503 });

  const body = await request.json() as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!email || !password) return NextResponse.json({ error: "Correo y contrasena son requeridos." }, { status: 400 });

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const rawError = `${data.msg ?? data.error_description ?? data.error ?? "No se pudo iniciar sesion."}`;
    const error = rawError.toLowerCase().includes("email not confirmed")
      ? "Activa tu cuenta desde el correo antes de iniciar sesion."
      : rawError;
    return NextResponse.json({ error }, { status: response.status });
  }

  const sessionResponse = await fetch(`${new URL(request.url).origin}/api/auth/session`, {
    headers: { authorization: `Bearer ${data.access_token}` },
    cache: "no-store",
  });
  const sessionData = await sessionResponse.json().catch(() => ({}));
  if (!sessionResponse.ok) {
    return NextResponse.json({ error: sessionData.error ?? "No se pudo validar la sesion." }, { status: sessionResponse.status });
  }

  return NextResponse.json({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    user: sessionData.user,
  });
}
