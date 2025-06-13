// app/callback/instagram/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function InstagramCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  
  useEffect(() => {
    const handleCallback = async () => {
      // Get the authorization code from URL
      const code = searchParams.get('code');
      
      if (!code) {
        setError('No authorization code received');
        setTimeout(() => router.push('/onboarding'), 3000);
        return;
      }
      
      try {
        // Send the code to your API to exchange for a token
        const response = await fetch('/api/auth/instagram-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          // Success - redirect to influencer dashboard
          router.push('/influencer/dashboard');
        } else {
          // Error handling
          setError(data.error || 'Failed to connect Instagram');
          setTimeout(() => router.push('/onboarding'), 3000);
        }
      } catch (error) {
        console.error('Error processing Instagram callback:', error);
        setError('Connection error');
        setTimeout(() => router.push('/onboarding'), 3000);
      }
    };
    
    handleCallback();
  }, [router, searchParams]);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>

    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
          <p>Redirecting back to onboarding...</p>
        </div>
      ) : (
        <>
          <Loading />
          <p className="mt-4 text-gray-600">Connecting your Instagram account...</p>
        </>
      )}
    </div>

    </Suspense>
  );
}