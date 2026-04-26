import { NextResponse } from "next/server";
import { getFxRates } from "@/lib/fx";

export const revalidate = 3600; // ISR: revalidate every hour

export async function GET() {
  const rates = await getFxRates();
  return NextResponse.json(
    { rates, base: "GBP", timestamp: Date.now() },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } }
  );
}
