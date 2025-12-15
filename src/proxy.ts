import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  // console.log("Middleware running for URL:", req.nextUrl.pathname);

  if (!token) {
    return NextResponse.redirect(new URL("/home/auth/sign-in", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch {
    console.log("No token");
    return NextResponse.redirect(new URL("/home/auth/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};

