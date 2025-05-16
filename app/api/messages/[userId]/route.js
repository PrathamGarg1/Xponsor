// app/api/messages/[userId]/route.js
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
    
    // Find the user in database using email from session
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }
    
    const currentUserId = currentUser.id;
    console.log("Current user ID from database:", currentUserId);
    
    const { userId } = await params;
    console.log("Fetching messages between users:", currentUserId, "and", userId);
    
    // Get all messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: currentUserId,
            receiverId: userId,
          },
          {
            senderId: userId,
            receiverId: currentUserId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    console.log(`Found ${messages.length} messages`);
    
    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: currentUserId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    
    return NextResponse.json({ messages, currentUserId });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ message: 'Internal server error ecc' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get sender ID and ensure it exists
    let senderId;
    if (session.user.id) {
      senderId = session.user.id;
    } else if (session.user.email) {
      // Fallback to finding user by email if ID isn't in session
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      
      senderId = user.id;
    } else {
      return NextResponse.json({ message: 'Cannot identify user' }, { status: 400 });
    }
    
    console.log("Sending message as user:", senderId);
    
    const body = await request.json();
    const { receiverId, content } = body;
    
    if (!receiverId || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    
    if (!receiver) {
      return NextResponse.json({ message: `Receiver not found: ${receiverId}` }, { status: 404 });
    }
    
    // Verify sender exists (double-check)
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });
    
    if (!sender) {
      return NextResponse.json({ message: `Sender not found in database: ${senderId}` }, { status: 404 });
    }
    
    // Create the message with explicit sender and receiver IDs
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    // Include more details in the error response
    return NextResponse.json({ 
      message: 'Internal server error', 
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}
