// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";

import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/db';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        
        // Get user type
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        
        if (user) {
          session.user.userType = user.userType;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
