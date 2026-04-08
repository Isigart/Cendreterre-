import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getRedis, keys } from "./redis";
import type { User } from "./types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const redis = getRedis();
        const userId = await redis.get<string>(
          keys.userByEmail(credentials.email)
        );
        if (!userId) return null;

        const user = await redis.get<User & { passwordHash: string }>(
          keys.user(userId)
        );
        if (!user) return null;

        // In production, use bcrypt to compare
        // For MVP, simple comparison (replace with proper hashing)
        const isValid = credentials.password === user.passwordHash;
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/connexion",
  },
};
