import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, Role, Plan } from "@prisma/client";
import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Global Prisma Client instance
const prisma = new PrismaClient();

// Add typing extensions for Role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      plan: Plan;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    plan: Plan;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    plan: Plan;
  }
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@sgt.com" },
        password: { label: "Password", type: "password" },
        mfaToken: { label: "MFA Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        // MFA Token Bypass
        if (credentials.mfaToken) {
          const mfaToken = credentials.mfaToken as string;
          const token = await prisma.verificationToken.findFirst({
            where: { identifier: `mfa-session-${user.id}`, token: mfaToken },
          });

          if (token && token.expires > new Date()) {
            await prisma.verificationToken.delete({ where: { token: mfaToken } });
            
            await prisma.auditLog.create({
              data: {
                userId: user.id,
                action: "LOGIN_SUCCESS_MFA",
                details: { method: "EMAIL" },
              },
            });

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              plan: user.plan,
            };
          }
          return null;
        }

        // Standard Password Login
        if (!user.password) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (passwordsMatch) {
          // If MFA is enabled, we expect the login form to have handled it via preCheckLogin.
          // But if they get here without MFA token and MFA is enabled, we still log it.
          
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: "LOGIN_SUCCESS",
              details: { mfaEnabled: user.twoFactorEnabled },
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            plan: user.plan,
          };
        }

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN_FAILURE",
            details: { reason: "Invalid password" },
          },
        });

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.plan = user.plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.plan = token.plan as Plan;
      }
      return session;
    }
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
