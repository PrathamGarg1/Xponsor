// app/api/user/type/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { userType } = await request.json();
    
    if (!userType || (userType !== 'influencer' && userType !== 'brand')) {
      return NextResponse.json({ message: 'Invalid user type' }, { status: 400 });
    }
    
    // Get or create user
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        userType,
        onboarded: userType === 'brand', // Only mark brands as onboarded here
        // Influencers need to connect Instagram first
      },
      create: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        userType,
        onboarded: userType === 'brand',
      },
    });
    
    // If user is a brand, create brand profile
    if (userType === 'brand') {
      await prisma.brandProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
        },
      });
    }
    
    return NextResponse.json({
      message: 'User type updated successfully',
      userType,
    });
  } catch (error) {
    console.error('Error updating user type:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}