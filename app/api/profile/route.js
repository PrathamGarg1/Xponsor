// app/api/profile/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        influencerProfile: true,
        brandProfile: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Return profile based on user type
    if (user.userType === 'influencer') {
      return NextResponse.json({ profile: user.influencerProfile });
    } else if (user.userType === 'brand') {
      return NextResponse.json({ profile: user.brandProfile });
    } else {
      return NextResponse.json({ message: 'Invalid user type' }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        influencerProfile: true,
        brandProfile: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Process request based on user type
    if (user.userType === 'influencer') {
      // Make sure followerCount and instagramHandle are not changed
      const { bio, pricePerReel, pricePerStory, pricePerPost, niche } = body;
      
      // Update influencer profile, but don't allow changes to followerCount or instagramHandle
      const updatedProfile = await prisma.influencerProfile.update({
        where: { userId: user.id },
        data: {
          bio: bio || user.influencerProfile.bio,
          pricePerReel: pricePerReel !== undefined ? parseFloat(pricePerReel) : user.influencerProfile.pricePerReel,
          pricePerStory: pricePerStory !== undefined ? parseFloat(pricePerStory) : user.influencerProfile.pricePerStory,
          pricePerPost: pricePerPost !== undefined ? parseFloat(pricePerPost) : user.influencerProfile.pricePerPost,
          niche: niche !== undefined ? niche : user.influencerProfile.niche,
          // Intentionally not updating instagramHandle and followerCount here
        },
      });
      
      return NextResponse.json({ profile: updatedProfile });
    } else if (user.userType === 'brand') {
      // Update brand profile (not shown in this example)
      return NextResponse.json({ message: 'Brand profile update not implemented yet' });
    } else {
      return NextResponse.json({ message: 'Invalid user type' }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}