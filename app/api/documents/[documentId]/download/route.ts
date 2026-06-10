import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authz";
import { createStorageDownloadUrl } from "@/lib/integrations";
import { ApiError, handleApiError } from "@/lib/api-error";

const staffRoles: UserRole[] = [UserRole.ADMIN, UserRole.KYC_REVIEWER, UserRole.SUPPORT_AGENT];

export async function GET(_request: Request, context: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await context.params;
  try {
    const user = await requireUser();
    const document = await prisma.document.findUnique({ where: { id: documentId }, select: { userId: true, fileUrl: true } });
    if (!document) throw new ApiError(404, "Document not found.", "NOT_FOUND");
    if (document.userId !== user.id && !staffRoles.includes(user.role)) {
      throw new ApiError(403, "You cannot access this document.", "DOCUMENT_OWNERSHIP_REQUIRED");
    }
    const signed = await createStorageDownloadUrl(document.fileUrl);
    return NextResponse.json(signed);
  } catch (error) {
    return handleApiError(error, { route: "GET /api/documents/[documentId]/download", documentId });
  }
}
