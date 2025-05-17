// app/onboarding/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  console.log(session);
  console.log("-----------------");
  console.log(status);
  const router = useRouter();
  
  const [userType, setUserType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if already onboarded
  useEffect(() => {
    if (status === 'authenticated' && session.user.onboarded) {
      const destination = session.user.userType === 'influencer' 
        ? '/influencer/dashboard' 
        : '/brand/dashboard';
      router.push(destination);
    }
  }, [session, status, router]);
  
  const handleContinue = async (type) => {
    setUserType(type);
    
    if (type === 'brand') {
      // For brands, complete onboarding directly
      try {
        setIsSubmitting(true);
        const response = await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userType: 'brand' })
        });
        
        if (response.ok) {
          router.push('/brand/dashboard');
        } else {
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
      }
    } 
    else {
      // For influencers, connect Instagram
      localStorage.setItem('pendingUserType', 'influencer');
      window.location.href = process.env.NEXT_PUBLIC_INSTAGRAM_AUTH_URL;
    }
  };

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Complete your profile</h1>
        
        <div className="space-y-6">
          <p className="text-center text-gray-600">Choose your account type:</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleContinue('influencer')}
              disabled={isSubmitting}
              className="p-4 border rounded-lg flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-500"
            >
              <span className="text-lg font-medium">Influencer</span>
              <span className="text-sm text-gray-500 mt-1">Connect Instagram</span>
            </button>
            
            <button
              onClick={() => handleContinue('brand')}
              disabled={isSubmitting}
              className="p-4 border rounded-lg flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-500"
            >
              <span className="text-lg font-medium">Brand</span>
              <span className="text-sm text-gray-500 mt-1">Work with influencers</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}