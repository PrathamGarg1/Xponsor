// Single
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    const campaign = await prisma.campaign.findUnique({
      where: { id },
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
    });
    
    if (!campaign) {
      return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
    }
    
    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ message: 'Internal server error ch333' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
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
    
    const { id } = params;
    
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });
    
    if (!campaign) {
      return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
    }
    
    // Check if user is the owner
    if (campaign.brandId !== user.id) {
      return NextResponse.json({ message: 'Forbidden: Not the campaign owner' }, { status: 403 });
    }
    
    const body = await request.json();
    const { title, description, minimumFollowers, minimumPayout, allowDirectMessages } = body;
    
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        title: title !== undefined ? title : campaign.title,
        description: description !== undefined ? description : campaign.description,
        minimumFollowers: minimumFollowers !== undefined ? minimumFollowers : campaign.minimumFollowers,
        minimumPayout: minimumPayout !== undefined ? minimumPayout : campaign.minimumPayout,
        allowDirectMessages: allowDirectMessages !== undefined ? allowDirectMessages : campaign.allowDirectMessages,
      },
    });
    
    return NextResponse.json({ campaign: updatedCampaign });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ message: 'Internal server error xwx' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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
    
    const { id } = params;
    
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });
    
    if (!campaign) {
      return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
    }
    
    // Check if user is the owner
    if (campaign.brandId !== user.id) {
      return NextResponse.json({ message: 'Forbidden: Not the campaign owner' }, { status: 403 });
    }
    
    await prisma.campaign.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({ message: 'Internal server error xwedx' }, { status: 500 });
  }
}
