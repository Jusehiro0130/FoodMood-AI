import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return NextResponse.json({ error: "Supabase Auth no configurado" }, { status: 503 });
  }

  return NextResponse.json({ supabaseUrl });
}
