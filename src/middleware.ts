import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname;
      // Protect /admin routes, but not /admin/login
      if (path.startsWith("/admin") && path !== "/admin/login") {
        return !!token;
      }
      return true;
    },
  },
});

export const config = { matcher: ["/admin/:path*"] };
