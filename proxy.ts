import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const staffRoles = ["ADMIN", "KYC_REVIEWER", "RATE_MANAGER", "DELIVERY_MANAGER", "SUPPORT_AGENT"];

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const path = request.nextUrl.pathname;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith("/admin") && !staffRoles.includes(String(token.role))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
