import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function POST(request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }
    
    const { code, pendingUserType } = await request.json();
    
    if (!code) {
      return NextResponse.json({ 
        success: false, 
        error: 'No code provided' 
      }, { status: 400 });
    }
    
    // Exchange the code for a token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('Instagram token error:', tokenData);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to get access token' 
      }, { status: 400 });
    }
    
    // Get user profile info with the token
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`
    );
    
    const profileData = await profileResponse.json();
    
    console.log('INSTAGRAM PROFILE DATA:', profileData);
    
    // // If you want to try getting more data: 
    // try {
    //   // Attempt to get additional data including media
    //   const mediaResponse = await fetch(
    //     `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${tokenData.access_token}`
    //   );
    //   const mediaData = await mediaResponse.json();
    //   console.log('INSTAGRAM MEDIA DATA:', JSON.stringify(mediaData, null, 2));
    // } catch (mediaError) {
    //   console.log('Could not fetch media data:', mediaError);
    // }
    
    // Try to get follower count if possible (requires business permissions)
    // try {
    //   const insightsResponse = await fetch(
    //     `https://graph.instagram.com/${profileData.id}/insights?metric=follower_count,impressions,reach,profile_views&period=day&access_token=${tokenData.access_token}`
    //   );
    //   const insightsData = await insightsResponse.json();
    //   console.log('INSTAGRAM INSIGHTS DATA:', JSON.stringify(insightsData, null, 2));
    // } catch (insightsError) {
    //   console.log('Could not fetch insights data:', insightsError);
    //   // This is expected to fail if you don't have proper permissions
    //   console.log('Note: Insights require a Business/Creator account and special permissions');
    // }

////////////////////////////
// Add this right after getting the profile data

let followerCount = 0;

// Try multiple approaches to get follower count
try {
  console.log('Attempting to get follower count...');
  
  if (followerCount === 0) {
    try {
      const userResponse = await fetch(
        `https://graph.instagram.com/${profileData.id}?fields=followers_count&access_token=${tokenData.access_token}`
      );
      const userData = await userResponse.json();
      console.log('User data response:', userData);
      
      if (userData.followers_count) {
        followerCount = userData.followers_count;
        console.log('Follower count from user data:', followerCount);
      }
    } catch (userError) {
      console.log('User subscribers endpoint failed:', userError.message);
    }
  }
  
  console.log('Final follower count:', followerCount);

} catch (mainError) {
  console.log('Follower fetch failedd');
}



    if (!profileData.username) {
      console.error('Instagram profile error:', profileData);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to get Instagram username' 
      }, { status: 400 });
    }
    
    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
   

    // user = await prisma.user.upsert({
    //   where: { email: session.user.email },
    //   update: {
    //     userType: 'influencer',
    //     onboarded: true,
    //   },
    //   create: {
    //     email: session.user.email,
    //     name: session.user.name,
    //     image: session.user.image,
    //     userType: 'influencer',
    //     onboarded: true,
    //   },
    // });
    
    // Create or update influencer profile
    await prisma.influencerProfile.upsert({
      where: { userId: user.id },
      update: {
        instagramHandle: profileData.username,
        followerCount: followerCount ,
      },
      create: {
        userId: user.id,
        instagramHandle: profileData.username,
        followerCount: followerCount,
        publicLink: `${process.env.NEXTAUTH_URL}/influencer/${user.id}`,
      },
    });
    
    return NextResponse.json({
      success: true,
      username: profileData.username,
    });
    
  } catch (error) {
    console.error('Instagram callback error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}