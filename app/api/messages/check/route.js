// app/api/messages/check/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }
    
    // Find the user in database using email from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }
    
    // Return basic status info
    return NextResponse.json({
      status: 'ok',
      message: 'Messages API is working',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error checking messages API:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}