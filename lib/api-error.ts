import { NextResponse } from "next/server";
import { logger } from "./logger";

export class ApiError extends Error {
  constructor(public status: number, message: string, public code: string) {
    super(message);
  }
}

export function validationError(details: unknown) {
  return NextResponse.json(
    { error: { code: "VALIDATION_ERROR", message: "Invalid request data.", details } },
    { status: 400 }
  );
}

export function handleApiError(error: unknown, context: Record<string, unknown> = {}) {
  if (error instanceof ApiError) {
    if (error.status >= 500) logger.error(error.message, error, context);
    else logger.warn(error.message, { ...context, code: error.code, status: error.status });
    return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.status });
  }
  logger.error("Unhandled API error", error, context);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "The request could not be completed." } },
    { status: 500 }
  );
}
