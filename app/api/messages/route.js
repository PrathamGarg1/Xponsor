// app/api/messages/route.js
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
    
    // Find the user in database using email from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }
    
    // Get the database user ID (not the OAuth ID)
    const userId = user.id;
    
    // Get all messages where the user is either sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            userType: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
            userType: true,
          },
        },
      },
    });
    
    // Group messages by conversation
    const conversations = {};
    
    messages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      
      if (!conversations[otherUserId]) {
        const otherUser = message.senderId === userId ? message.receiver : message.sender;
        
        conversations[otherUserId] = {
          id: otherUserId,
          user: otherUser,
          lastMessage: message,
          unreadCount: message.senderId !== userId && !message.isRead ? 1 : 0,
        };
      } else if (message.senderId !== userId && !message.isRead) {
        conversations[otherUserId].unreadCount += 1;
      }
    });
    
    return NextResponse.json({ conversations: Object.values(conversations) });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ message: 'Internal server error dce' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Find the sender in database using email from session
    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!sender) {
      return NextResponse.json({ message: 'Sender not found in database' }, { status: 404 });
    }
    
    // Get the Prisma database user ID (not the OAuth ID)
    const senderId = sender.id;
    
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
      return NextResponse.json({ message: 'Receiver not found' }, { status: 404 });
    }
    
    // Create the message with explicit sender and receiver IDs from the database
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
    
    return NextResponse.json({ 
      success: true,
      message
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
