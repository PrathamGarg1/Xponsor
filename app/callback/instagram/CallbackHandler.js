// app/callback/instagram/CallbackHandler.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Connecting your Instagram account...');

  useEffect(() => {
    const handleCallback = async () => {
      // Get the authorization code from URL
      const code = searchParams.get('code');
      
      if (!code) {
        setError('Authorization code not found. Please try again.');
        setMessage('Redirecting back to onboarding...');
        setTimeout(() => router.push('/onboarding'), 3000);
        return;
      }
      
      try {
        // Send the code to your API to exchange for a token
        const response = await fetch('/api/auth/instagram-callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          // Success - redirect to influencer dashboard
          setMessage('Successfully connected! Redirecting...');
          router.push('/influencer/dashboard');
        } else {
          // Error handling
          setError(data.error || 'Failed to connect Instagram account.');
          setMessage('Redirecting back to onboarding...');
          setTimeout(() => router.push('/onboarding'), 3000);
        }
      } catch (err) {
        console.error('Error processing Instagram callback:', err);
        setError('An unexpected connection error occurred.');
        setMessage('Redirecting back to onboarding...');
        setTimeout(() => router.push('/onboarding'), 3000);
      }
    };
    
    handleCallback();
  }, [router, searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {!error && <Loading />}
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}
