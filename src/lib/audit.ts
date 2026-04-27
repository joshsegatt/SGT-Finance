import { db } from "./db";
import { headers } from "next/headers";

export async function createAuditLog(userId: string, action: string, details?: any) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    await db.auditLog.create({
      data: {
        userId,
        action,
        details: details || {},
        ipAddress: ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}
