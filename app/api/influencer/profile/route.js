// app/api/influencer/profile/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { influencerProfile: true },
    });
    
    if (!user || user.userType !== 'influencer') {
      return NextResponse.json({ message: 'Forbidden: Not an influencer' }, { status: 403 });
    }
    
    return NextResponse.json({ profile: user.influencerProfile });
  } catch (error) {
    console.error('Error fetching influencer profile:', error);
    return NextResponse.json({ message: 'Internal server error dxwdx'  }, { status: 500 });
  }
}
export async function PUT(request) {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      
      // Get user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { influencerProfile: true },
      });
      
      if (!user || user.userType !== 'influencer') {
        return NextResponse.json({ message: 'Forbidden: Not an influencer' }, { status: 403 });
      }
      
      const body = await request.json();
      const { followerCount, pricePerReel, pricePerStory, pricePerPost, niche, instagramHandle, allowMessages } = body;
      
      const updatedProfile = await prisma.influencerProfile.update({
        where: { userId: user.id },
        data: {
          // Convert string values to numbers for numeric fields
          followerCount: followerCount !== undefined ? parseInt(followerCount, 10) : user.influencerProfile.followerCount,
          pricePerReel: pricePerReel !== undefined ? parseFloat(pricePerReel) : user.influencerProfile.pricePerReel,
          pricePerStory: pricePerStory !== undefined ? parseFloat(pricePerStory) : user.influencerProfile.pricePerStory,
          pricePerPost: pricePerPost !== undefined ? parseFloat(pricePerPost) : user.influencerProfile.pricePerPost,
          niche: niche !== undefined ? niche : user.influencerProfile.niche,
          instagramHandle: instagramHandle !== undefined ? instagramHandle : user.influencerProfile.instagramHandle,
        },
      });
      
      return NextResponse.json({ profile: updatedProfile });
    } catch (error) {
      console.error('Error updating influencer profile:', error);
      return NextResponse.json({ message: 'Internal server error ddx' }, { status: 500 });
    }
  }
  