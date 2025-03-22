import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [Google, Discord],
} satisfies NextAuthConfig;
