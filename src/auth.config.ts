import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import type { NextAuthConfig } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export default {
  providers: [Google, Discord],
  callbacks: {
    authorized: async ({ auth, request }) => {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
