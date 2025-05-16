// app/api/influencer/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const influencer = await prisma.user.findUnique({
      where: { id },
      include: { influencerProfile: true },
    });
    
    if (!influencer || influencer.userType !== 'influencer') {
      return NextResponse.json({ message: 'Influencer not found' }, { status: 404 });
    }
    
    // Return public profile data
    return NextResponse.json({
      id: influencer.id,
      name: influencer.name,
      image: influencer.image,
      profile: {
        followerCount: influencer.influencerProfile.followerCount,
        pricePerReel: influencer.influencerProfile.pricePerReel,
        pricePerStory: influencer.influencerProfile.pricePerStory,
        pricePerPost: influencer.influencerProfile.pricePerPost,
        niche: influencer.influencerProfile.niche,
        instagramHandle: influencer.influencerProfile.instagramHandle,
        allowMessages: influencer.influencerProfile.allowMessages,
        publicLink: influencer.influencerProfile.publicLink,
      },
    });
  } catch (error) {
    console.error('Error fetching influencer profile:', error);
    return NextResponse.json({ message: 'Internal server error xwd' }, { status: 500 });
  }
}
