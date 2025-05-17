// app/api/auth/[...nextauth]/route.js
import NextAuth, { getServerSession } from "next-auth";

import GoogleProvider from 'next-auth/providers/google';
import InstagramProvider from 'next-auth/providers/google';
import prisma from '@/lib/db';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // InstagramProvider({
    //   clientId: process.env.INSTAGRAM_CLIENT_ID,
    //   clientSecret: process.env.INSTAGRAM_CLIENT_SECRET
    // })
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
          session.user.onboarded = user.onboarded || false;

        }
      }
      return session;
    },

    // async redirect({ url, baseUrl }) {
    //   // Check if the user needs to complete onboarding
    //   const session = await getServerSession(authOptions);
    //   if (session) {
    //     const user = await prisma.user.findUnique({
    //       where: { email: session.user.email },
    //     });
        
    //     // If user exists and has completed onboarding, go to dashboard
    //     if (user && user.onboarded) {
    //       if (user.userType === 'influencer') {
    //         return `${baseUrl}/influencer/dashboard`;
    //       } else if (user.userType === 'brand') {
    //         return `${baseUrl}/brand/dashboard`;
    //       }
    //     }
        
    //     // Otherwise go to onboarding
    //     return `${baseUrl}/onboarding`;
    //   }
      
    //   // Default fallback
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },



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
