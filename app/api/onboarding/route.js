// app/onboarding/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // If not logged in, redirect to home
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    
    // If already onboarded, redirect to dashboard
    if (status === 'authenticated' && session.user.onboarded) {
      if (session.user.userType === 'influencer') {
        router.push('/influencer/dashboard');
      } else {
        router.push('/brand/dashboard');
      }
      return;
    }
    
    // Get selected user type from localStorage
    const userType = localStorage.getItem('selectedUserType');
    
    // If user selected brand, update db and redirect to brand dashboard
    if (userType === 'brand') {
      updateUserType('brand');
    }
    // For influencers, we stay on this page to connect Instagram
  }, [session, status, router]);
  
  const updateUserType = async (type) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userType: type })
      });
      
      if (response.ok) {
        router.push(type === 'influencer' ? '/onboarding' : '/brand/dashboard');
      } else {
        console.error('Failed to update user type');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const connectInstagram = () => {
    // Redirect to Instagram auth
    window.location.href = process.env.NEXT_PUBLIC_INSTAGRAM_AUTH_URL;
  };
  
  if (status === 'loading' || isLoading) {
    return <Loading />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Connect Your Instagram Account</h1>
          <p className="mt-2 text-gray-600">
            As an influencer, you need to connect your Instagram account to continue.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold flex items-center text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Why Connect Instagram?
          </h3>
          <ul className="mt-2 text-sm text-blue-800 space-y-1">
            <li>• Verify your influencer status</li>
            <li>• Import your follower count</li>
            <li>• Showcase your Instagram handle to brands</li>
            <li>• Get discovered by brands looking for your audience type</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-700">Data Privacy</h3>
          <p className="mt-1 text-sm text-gray-600">
            We follow all Instagram Platform Policies and only request access to your public profile information. 
            We'll never post on your behalf or access your private messages.
          </p>
        </div>
        
        <button
          onClick={connectInstagram}
          className="w-full flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
          </svg>
          Connect Instagram Account
        </button>
      </div>
    </div>
  );
}