// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
export const runtime = 'nodejs';


export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // <= OBRIGATÓRIO

  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user || !user.hashedPassword) return null;

        const ok = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
          image: user.image ?? null,
          role: user.role, // Student | Teacher etc.
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userWithRole = user as { role: "STUDENT" | "TEACHER"; id: string };
        token.role = userWithRole.role;
        token.id = userWithRole.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as { id?: string; role?: "STUDENT" | "TEACHER" };
        sessionUser.id = token.id as string;
        sessionUser.role = token.role as "STUDENT" | "TEACHER";
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    // signUp: "/auth/signup", // ❌ NÃO SUPORTADO
    // Opcional: primeira vez que loga (ex.: redirect pós-OAuth/criação automática)
    // newUser: "/onboarding"
    error: "/auth/error",
  },
};
