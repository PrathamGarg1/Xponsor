import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  // For webhook verification
  const searchParams = new URL(request.url).searchParams;
  const hubMode = searchParams.get('hub.mode');
  const hubChallenge = searchParams.get('hub.challenge');
  const hubVerifyToken = searchParams.get('hub.verify_token');
  
  // This should match the Verify Token you set in the Instagram webhook configuration
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
  
  if (hubMode === 'subscribe' && hubVerifyToken === verifyToken) {
    console.log('Instagram webhook verified successfully');
    return new Response(hubChallenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  return new Response('Verification failed', { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Instagram webhook received:', JSON.stringify(body, null, 2));
    
    // Handle different webhook events
    // This is a simple implementation - expand as needed
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 200 });
  }
}