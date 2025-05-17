// // middleware.js
import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
//   const token = await getToken({ req: request });
  
//   // If user is not logged in, redirect to login
//   if (!token) {
//     return NextResponse.redirect(new URL('/api/auth/signin', request.url));
//   }
  
//   // Get path
//   const path = request.nextUrl.pathname;
  
//   // Get user from database to check onboarding and userType
//   const res = await fetch(new URL('/api/user', request.url).toString(), {
//     headers: {
//       Cookie: request.headers.get('cookie') || '',
//     },
//   });
  
//   const userData = await res.json();
  
//   // If user hasn't completed onboarding, redirect to onboarding
//   if (!userData.onboarded) {
//     return NextResponse.redirect(new URL('/onboarding', request.url));
//   }
  
//   // If user is trying to access wrong user type routes
//   if (path.startsWith('/influencer') && userData.userType !== 'influencer') {
//     return NextResponse.redirect(new URL('/brand/dashboard', request.url));
//   }
  
//   if (path.startsWith('/brand') && userData.userType !== 'brand') {
//     return NextResponse.redirect(new URL('/influencer/dashboard', request.url));
//   }
  
  return NextResponse.next();
}

// export const config = {
//   matcher: ['/influencer/:path*', '/brand/:path*'],
// };