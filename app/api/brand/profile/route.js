// app/api/brand/profile/route.js
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
      include: { brandProfile: true },
    });
    
    if (!user || user.userType !== 'brand') {
      return NextResponse.json({ message: 'Forbidden: Not a brand' }, { status: 403 });
    }
    
    return NextResponse.json({ profile: user.brandProfile });
  } catch (error) {
    console.error('Error fetching brand profile:', error);
    return NextResponse.json({ message: 'Internal server error checked' }, { status: 500 });
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
      include: { brandProfile: true },
    });
    
    if (!user || user.userType !== 'brand') {
      return NextResponse.json({ message: 'Forbidden: Not a brand' }, { status: 403 });
    }
    
    const body = await request.json();
    const { companyName, industry, website } = body;
    
    const updatedProfile = await prisma.brandProfile.update({
      where: { userId: user.id },
      data: {
        companyName: companyName !== undefined ? companyName : user.brandProfile.companyName,
        industry: industry !== undefined ? industry : user.brandProfile.industry,
        website: website !== undefined ? website : user.brandProfile.website,
      },
    });
    
    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Error updating brand profile:', error);
    return NextResponse.json({ message: 'Internal server error ch2' }, { status: 500 });
  }
}
