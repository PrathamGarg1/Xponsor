//Influencer Browsing API

// app/api/influencers/route.js
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
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const minFollowers = searchParams.get('minFollowers');
    const maxPrice = searchParams.get('maxPrice');
    const niche = searchParams.get('niche');
    
    // Build filter conditions
    const whereConditions = {
      user: {
        userType: 'influencer',
      },
    };
    
    if (minFollowers) {
      whereConditions.followerCount = { gte: parseInt(minFollowers) };
    }
    
    if (niche) {
      whereConditions.niche = niche;
    }
    
    let influencers = await prisma.influencerProfile.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    // Filter by price if needed
    if (maxPrice) {
      const maxPriceValue = parseFloat(maxPrice);
      influencers = influencers.filter(influencer => {
        const prices = [
          influencer.pricePerPost,
          influencer.pricePerReel,
          influencer.pricePerStory,
        ].filter(price => price !== null);
        
        // If any price is below the max price, include the influencer
        return prices.some(price => price <= maxPriceValue);
      });
    }
    
    return NextResponse.json({ influencers });
  } catch (error) {
    console.error('Error fetching influencers:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
