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
    async signIn({ user, account }) {
      if (account?.provider !== 'google' || !user.email) {
        return false; 
      }

      const cookieStore = await cookies();
      const userTypeCookie = cookieStore.get('user-type-selection');
      console.log("userTypeCookie:",userTypeCookie)
      const userType = userTypeCookie?.value;
      console.log("usertype:",userType)

      if (userTypeCookie) {
        cookieStore.delete('user-type-selection');
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });
      
      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
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
