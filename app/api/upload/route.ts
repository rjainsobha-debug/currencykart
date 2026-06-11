import { NextResponse } from "next/server";
import { createStorageUploadUrl } from "@/lib/integrations";
import { allowedDocumentMimeTypes, maxDocumentSizeBytes } from "@/lib/security";
import { uploadSchema } from "@/lib/validations";
import { requireOrderOwner, requireUser } from "@/lib/authz";
import { enforceRateLimit, requestIdentifier } from "@/lib/rate-limit";
import { ApiError, handleApiError, validationError } from "@/lib/api-error";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    enforceRateLimit("upload", requestIdentifier(request, user.id));
    const parsed = uploadSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.flatten());
    if (parsed.data.orderId) await requireOrderOwner(parsed.data.orderId);
    if (!allowedDocumentMimeTypes.includes(parsed.data.mimeType)) throw new ApiError(400, "Unsupported file type.", "UNSUPPORTED_FILE_TYPE");
    if (parsed.data.size > maxDocumentSizeBytes) throw new ApiError(400, "File exceeds the 8 MB limit.", "FILE_TOO_LARGE");
    const upload = await createStorageUploadUrl(parsed.data.fileName, parsed.data.mimeType);
    return NextResponse.json({
      upload,
      document: {
        type: parsed.data.type,
        orderId: parsed.data.orderId,
        status: "PENDING",
        note: "Persist the document record only after storage confirms upload completion."
      }
    });
  } catch (error) {
    return handleApiError(error, { route: "POST /api/upload" });
  }
}
