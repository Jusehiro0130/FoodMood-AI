import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return NextResponse.json({ error: "Auth no configurado" }, { status: 503 });

  const body = await request.json() as { email?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  if (!email) return NextResponse.json({ error: "Escribe el correo para reenviar la verificacion." }, { status: 400 });

  const origin = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? new URL(request.url).origin;
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/resend`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      type: "signup",
      email,
      options: {
        email_redirect_to: `${origin}/auth/callback`,
      },
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json({ error: data.msg ?? data.error_description ?? data.error ?? "No se pudo reenviar el correo." }, { status: response.status });
  }

  return NextResponse.json({
    ok: true,
    message: "Si la cuenta esta pendiente de activacion, Supabase enviara otro correo de verificacion.",
  });
}
