// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/ui/Loading';

export default function Home() {
  const { data: session, status } = useSession();
  const { user, loading, setUserType } = useAuth();
  const router = useRouter();
  const [userTypeSelection, setUserTypeSelection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use useEffect for navigation instead of doing it during render
  useEffect(() => {
    if (user?.userType === 'influencer') {
      router.push('/influencer/dashboard');
    } else if (user?.userType === 'brand') {
      router.push('/brand/dashboard');
    }
  }, [user?.userType, router]);

  // If loading auth state, show loading spinner
  if (loading || status === 'loading') {
    return <Loading />;
  }

  // If user is authenticated but doesn't have a user type, show user type selection
  if (session && !user?.userType) {
    const handleContinue = async () => {
      if (!userTypeSelection) return;
      
      setIsSubmitting(true);
      await setUserType(userTypeSelection);
      setIsSubmitting(false);
    };

    

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">Xponsor</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Tell us who you are
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="influencer"
                      name="userType"
                      type="radio"
                      checked={userTypeSelection === 'influencer'}
                      onChange={() => setUserTypeSelection('influencer')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="influencer" className="ml-3 block text-sm font-medium text-gray-700">
                      I'm an Influencer
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="brand"
                      name="userType"
                      type="radio"
                      checked={userTypeSelection === 'brand'}
                      onChange={() => setUserTypeSelection('brand')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="brand" className="ml-3 block text-sm font-medium text-gray-700">
                      I'm a Brand
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={handleContinue}
                  disabled={!userTypeSelection || isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !userTypeSelection || isSubmitting
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show login options
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Xponsor</h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Connect Brands and Influencers
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          The platform where brands and influencers collaborate
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <button
                onClick={() => signIn('google')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in with Google
              </button>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue as a guest
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button
                    onClick={() => {
                      setUserTypeSelection('influencer');
                      signIn('google');
                    }}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Influencer
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setUserTypeSelection('brand');
                      signIn('google');
                    }}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Brand
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
