import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken");

  if (!token) {
    // Redirect to /Signup if the user is not authenticated
    return NextResponse.redirect(new URL("/SignIn", request.url));
  }

  // Allow the request to proceed if the token is present
  return NextResponse.next();
}

// Configure middleware to run for all pages except static files and Signup page
export const config = {
  matcher: "/((?!_next|Signup|SignIn|api|favicon.ico).*)",
};
