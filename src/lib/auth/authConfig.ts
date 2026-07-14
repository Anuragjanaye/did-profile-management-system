import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { getStoredNonce, clearStoredNonce } from "@/features/auth/actions/authActions";

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "SIWE",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message || !credentials?.signature) {
            return null;
          }

          const message =
            typeof credentials.message === "string"
              ? credentials.message
              : JSON.stringify(credentials.message);
          const signature = credentials.signature as string;

          const siweMessage = new SiweMessage(message);

          // Retrieve the challenge nonce from the secure HTTP cookie
          const nonce = await getStoredNonce();

          if (!nonce) {
            console.error("SIWE verification failed: Nonce cookie missing or expired");
            return null;
          }

          // Verify the SIWE message against signature and correct nonce
          const verification = await siweMessage.verify({
            signature,
            nonce,
          });

          if (!verification.success) {
            console.error("SIWE verification failed: Invalid signature or mismatched nonce");
            return null;
          }

          // Nonce is verified and consumed, clear it to prevent replay attacks
          await clearStoredNonce();

          // Return the authenticated wallet user (No database lookup in Phase 2)
          return {
            id: siweMessage.address,
            walletAddress: siweMessage.address,
            role: "USER", // Default role in Phase 2
          };
        } catch (error) {
          console.error("SIWE authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days session TTL
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.walletAddress = user.walletAddress;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.walletAddress = token.walletAddress as string;
        session.user.role = token.role as "USER" | "ADMIN" | "SUPER_ADMIN";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
