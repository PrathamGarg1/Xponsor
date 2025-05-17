// app/callback/instagram/page.js
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function InstagramCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      
      // Get pending user type
      const pendingUserType = localStorage.getItem('pendingUserType');
      
      if (error) {
        console.error('Instagram error:', error);
        router.push('/onboarding?error=instagram');
        return;
      }
      
      if (!code) {
        router.push('/onboarding');
        return;
      }
      
      try {
        // Exchange code for token and complete onboarding
        const response = await fetch('/api/auth/instagram-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            code,
            pendingUserType : 'influencer' 
          })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          // Clear localStorage
          localStorage.removeItem('pendingUserType');
          
          // Redirect to dashboard
          router.push('/influencer/dashboard');
        } else {
          console.error('Instagram callback error:', data.error);
          router.push('/onboarding?error=instagram');
        }
      } catch (error) {
        console.error('Error processing callback:', error);
        router.push('/onboarding?error=instagram');
      }
    };
    
    handleCallback();
  }, [router, searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loading />
      <p className="mt-4 text-gray-600">Connecting your Instagram account...</p>
    </div>
  );
}