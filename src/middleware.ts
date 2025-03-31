import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  let redirectUrl: string | null = null;
  let message: string | null = null;

  if (token && req.nextUrl.pathname === "/login") {
    redirectUrl = "/dashboard";
    message = "Already logged in";
  }

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    redirectUrl = "/login";
    message = "Please log in first";
  }

  if (!token && req.nextUrl.pathname === "/") {
    redirectUrl = "/login";
    message = "Please log in first";
  }

  if (redirectUrl) {
    const response = NextResponse.redirect(new URL(redirectUrl, req.url));

    if (message) {
      response.cookies.set("toastMessage", message, { path: "/", maxAge: 5 });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
