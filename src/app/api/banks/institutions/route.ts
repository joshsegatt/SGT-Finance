import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInstitutions } from "@/lib/gocardless";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const country = req.nextUrl.searchParams.get("country") ?? "GB";

  try {
    const institutions = await getInstitutions(country);
    return NextResponse.json(institutions);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch institutions";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
