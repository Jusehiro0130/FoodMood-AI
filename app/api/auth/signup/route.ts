import { NextResponse } from "next/server";

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

async function createConfirmedUser(input: {
  supabaseUrl: string;
  serviceRoleKey: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}) {
  const response = await fetch(`${input.supabaseUrl.replace(/\/$/, "")}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: input.serviceRoleKey,
      authorization: `Bearer ${input.serviceRoleKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        first_name: input.firstName,
        last_name: input.lastName,
        username: input.username,
        name: `${input.firstName} ${input.lastName}`,
        full_name: `${input.firstName} ${input.lastName}`,
      },
    }),
    cache: "no-store",
  });

  return {
    ok: response.ok,
    status: response.status,
    data: await response.json().catch(() => ({})),
  };
}

async function createPasswordSession(input: { supabaseUrl: string; anonKey: string; origin: string; email: string; password: string }) {
  const response = await fetch(`${input.supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: input.anonKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ email: input.email, password: input.password }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return { ok: false, status: response.status, data };

  const sessionResponse = await fetch(`${input.origin}/api/auth/session`, {
    headers: { authorization: `Bearer ${data.access_token}` },
    cache: "no-store",
  });
  const sessionData = await sessionResponse.json().catch(() => ({}));
  if (!sessionResponse.ok) return { ok: false, status: sessionResponse.status, data: sessionData };

  return {
    ok: true,
    status: 200,
    data: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      user: sessionData.user,
    },
  };
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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

  const origin = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? new URL(request.url).origin;
  if (serviceRoleKey) {
    const adminSignup = await createConfirmedUser({ supabaseUrl, serviceRoleKey, email, password, firstName, lastName, username });
    if (!adminSignup.ok) {
      const error = adminSignup.data.msg ?? adminSignup.data.error_description ?? adminSignup.data.error ?? "No se pudo crear la cuenta.";
      return NextResponse.json({ error }, { status: adminSignup.status });
    }

    const session = await createPasswordSession({ supabaseUrl, anonKey, origin, email, password });
    if (!session.ok) {
      return NextResponse.json({
        ok: true,
        message: "Cuenta creada. Inicia sesion con tu correo y contrasena.",
      });
    }

    return NextResponse.json({
      ok: true,
      confirmed: true,
      message: "Cuenta creada. Entrando a FoodMood.",
      ...session.data,
    });
  }

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

  if (data.access_token) {
    const sessionResponse = await fetch(`${origin}/api/auth/session`, {
      headers: { authorization: `Bearer ${data.access_token}` },
      cache: "no-store",
    });
    const sessionData = await sessionResponse.json().catch(() => ({}));
    if (sessionResponse.ok) {
      return NextResponse.json({
        ok: true,
        confirmed: true,
        message: "Cuenta creada. Entrando a FoodMood.",
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        user: sessionData.user,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Revisa tu correo para activar la cuenta antes de iniciar sesion.",
  });
}
