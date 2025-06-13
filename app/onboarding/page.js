// app/onboarding/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If not logged in, redirect to home
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    
    // Check if the user is already onboarded
    if (status === 'authenticated' && session?.user?.onboarded) {
      // Redirect based on user type
      if (session.user.userType === 'influencer') {
        router.push('/influencer/dashboard');
      } else if (session.user.userType === 'brand') {
        router.push('/brand/dashboard');
      } else {
        router.push('/');
      }
      return;
    }
    
    // Get selected user type from localStorage
    // const userType = localStorage.getItem('selectedUserType');
    
    // Update user type in database
    // if (status === 'authenticated') {
    //   updateUserType(userType || 'influencer');
    // }
  }, [session, status, router]);
  
  // const updateUserType = async (userType) => {
  //   try {
  //     const response = await fetch('/api/user/type', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ userType })
  //     });
      
  //     // If it's a brand, they're fully onboarded, redirect to dashboard
  //     if (userType === 'brand' && response.ok) {
  //       router.push('/brand/dashboard');
  //     } else {
  //       // For influencers, we stay on this page for Instagram connection
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.error('Error updating user type:', error);
  //     setIsLoading(false);
  //   }
  // };
  
  const connectInstagram = () => {
    window.location.href = process.env.NEXT_PUBLIC_INSTAGRAM_AUTH_URL;
  };
  
  if (status === 'loading') {
    return <Loading />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Connect Your Instagram</h1>
        <p className="text-center text-gray-600 mb-6">
          Just one more step to complete your influencer profile
        </p>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Why connect Instagram?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-start">
                <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Verify your account and showcase your Instagram handle</span>
              </li>
              <li className="flex items-start">
                <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Import your follower count to increase brand interest</span>
              </li>
              <li className="flex items-start">
                <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Get discovered by brands looking for your audience</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">We follow Instagram's rules</h3>
            <p className="text-sm text-gray-600">
              We only request access to public information about your profile.
              We won't post anything or access your private messages. All data
              handling follows Instagram's Platform Policy.
            </p>
          </div>
          
          <button
            onClick={connectInstagram}
            className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600"
          >
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
            </svg>
            Connect Instagram Account
          </button>
        </div>
      </div>
    </div>
  );
}