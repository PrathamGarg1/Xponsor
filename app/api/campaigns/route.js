// app/api/campaigns/route.js
// Campaigns List API

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
    
    // Parse URL to get query parameters
    const url = new URL(request.url);
    const minimumPayout = url.searchParams.get('minimumPayout');
    const minimumFollowers = url.searchParams.get('minimumFollowers');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    console.log("API received filters:", { minimumPayout, minimumFollowers, page, limit });
    
    let whereClause = {};
    
    // Add filters to where clause if they exist
    if (minimumPayout) {
      whereClause.minimumPayout = { gte: parseFloat(minimumPayout) };
    }
    
    if (minimumFollowers) {
      whereClause.minimumFollowers = { gte: parseInt(minimumFollowers) };
    }
    
    let campaigns;
    
    if (user.userType === 'brand') {
      // Brand gets their own campaigns
      whereClause.brandId = user.id;
      
      campaigns = await prisma.campaign.findMany({
        where: whereClause,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              image: true,
              brandProfile: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Influencer gets campaigns that match their criteria
      const influencerProfile = await prisma.influencerProfile.findUnique({
        where: { userId: user.id },
      });
      
      if (!influencerProfile) {
        return NextResponse.json({ message: 'Influencer profile not found' }, { status: 404 });
      }
      
      // Add follower count filter for influencers
      whereClause.minimumFollowers = { 
        lte: influencerProfile.followerCount,
        ...(whereClause.minimumFollowers || {})
      };
      
      campaigns = await prisma.campaign.findMany({
        where: whereClause,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              image: true,
              brandProfile: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
    }
    
    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
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
    
    if (user.userType !== 'brand') {
      return NextResponse.json({ message: 'Forbidden: Only brands can create campaigns' }, { status: 403 });
    }
    
    const body = await request.json();
    const { title, description, minimumFollowers, minimumPayout, allowDirectMessages } = body;
    
    if (!title || !description || minimumFollowers === undefined || minimumPayout === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        minimumFollowers,
        minimumPayout,
        allowDirectMessages: allowDirectMessages !== undefined ? allowDirectMessages : true,
        brandId: user.id,
      },
    });
    
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ message: 'Internal server error ch33' }, { status: 500 });
  }
}
