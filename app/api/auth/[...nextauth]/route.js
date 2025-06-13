// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/db';
import { cookies } from 'next/headers'; // This import is correct

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
      if (session?.user?.email) {
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
    // --- THIS IS THE CORRECTED signIn CALLBACK ---
    async signIn({ user, account }) {
      if (account?.provider !== 'google' || !user.email) {
        return false; // Stop sign-in if not Google or no email
      }

      // 1. AWAIT the cookies() function to get the cookie store
      const cookieStore = await cookies();
      const userTypeCookie = cookieStore.get('user-type-selection');
      console.log("userTypeCookie:",userTypeCookie)
      const userType = userTypeCookie?.value;
      console.log("usertype:",userType)

      // 2. DELETE the cookie after reading its value
      if (userTypeCookie) {
        cookieStore.delete('user-type-selection');
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });
      
      if (!existingUser) {
        // Create the user with the userType from the cookie
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            // Use the value from the cookie, with a fallback just in case
            userType: userType || 'influencer'
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
