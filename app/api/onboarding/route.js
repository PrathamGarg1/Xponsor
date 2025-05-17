// app/api/onboarding/route.js
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
    
    if (userType !== 'brand') {
      return NextResponse.json({ 
        message: 'Influencers must connect Instagram account' 
      }, { status: 400 });
    }
    
    // Update or create the user
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        userType: 'brand',
        onboarded: true,
      },
      create: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        userType: 'brand',
        onboarded: true,
      },
    });
    
    // Create brand profile if it doesn't exist
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: user.id },
    });
    
    if (!brandProfile) {
      await prisma.brandProfile.create({
        data: {
          userId: user.id,
        },
      });
    }
    
    return NextResponse.json({ 
      message: 'Onboarding completed successfully',
      userType: 'brand'
    });
    
  } catch (error) {
    console.error('Error during onboarding:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}