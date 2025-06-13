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
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        
        // Get user data
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        
        if (user) {
          session.user.userType = user.userType;
          session.user.onboarded = user.onboarded || false;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Check if this is a new user
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });
      
      if (!existingUser) {
        // Create the user with a pending userType (will be updated during onboarding)
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            // userType will be set during onboarding
          }
        });
      }
      
      return true;
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