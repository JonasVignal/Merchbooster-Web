import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const artist = await prisma.artist.findUnique({
          where: { email: credentials.email }
        });
        
        if (!artist || artist.passwordHash !== credentials.password) {
          // Note: In production, use bcrypt to compare hashes!
          return null;
        }

        return {
          id: artist.id,
          email: artist.email,
          name: artist.name,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecret"
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
