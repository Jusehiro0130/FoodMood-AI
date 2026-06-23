import { NextResponse } from "next/server";
import { getRestaurantsForApp } from "@/lib/data/restaurants-service";

export async function GET() {
  const data = await getRestaurantsForApp();
  return NextResponse.json(data);
}
