import { NextResponse } from "next/server";

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return NextResponse.json({ error: "Auth no configurado" }, { status: 503 });

  const body = await request.json() as {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
  };
  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const username = normalizeUsername(body.username ?? "");
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!firstName || !lastName || !username || !email || password.length < 8) {
    return NextResponse.json({ error: "Completa todos los campos. La contrasena debe tener al menos 8 caracteres." }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const url = new URL(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/signup`);
  url.searchParams.set("redirect_to", `${origin}/auth/callback`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: {
        first_name: firstName,
        last_name: lastName,
        username,
        name: `${firstName} ${lastName}`,
        full_name: `${firstName} ${lastName}`,
      },
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json({ error: data.msg ?? data.error_description ?? data.error ?? "No se pudo crear la cuenta." }, { status: response.status });
  }

  return NextResponse.json({
    ok: true,
    message: "Revisa tu correo para activar la cuenta antes de iniciar sesion.",
  });
}
