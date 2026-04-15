import { prisma } from "@/lib/db";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN";

export async function recordAuditLog(input: {
  adminId?: string | null;
  action: AuditAction;
  resourceType: string;
  resourceId?: string | null;
  changes?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: input.adminId ?? undefined,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId ?? undefined,
        changes:
          input.changes === undefined
            ? undefined
            : (input.changes as object),
        ipAddress: input.ipAddress ?? undefined,
        userAgent: input.userAgent ?? undefined,
      },
    });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}
