// app/api/auth/user-type/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { userType } = body;
    
    if (!userType || (userType !== 'brand' && userType !== 'influencer')) {
      return NextResponse.json({ message: 'Invalid user type' }, { status: 400 });
    }
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { email: session.user.email },
        data: { userType },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          userType,
        },
      });
      
      // Create respective profile
      if (userType === 'influencer') {
        await prisma.influencerProfile.create({
          data: {
            userId: user.id,
            followerCount: 0,
            publicLink: `${process.env.NEXTAUTH_URL}/influencer/${user.id}`,
          },
        });
      } 
      else {
        await prisma.brandProfile.create({
          data: {
            userId: user.id,
          },
        });
      }
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error setting user type:', error);
    return NextResponse.json({ message: 'Internal server error chck' }, { status: 500 });
  }
}
