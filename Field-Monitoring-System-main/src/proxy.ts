import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Next.js 16: The 'middleware' convention is replaced by 'proxy'.
export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protection logic
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // You can add more role-based protection here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/fields/:path*", "/admin/:path*"],
};
