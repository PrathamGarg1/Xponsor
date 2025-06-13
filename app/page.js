// app/page.js
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleUserTypeSelect = (type) => {
    // localStorage.setItem('selectedUserType', type);
    const callbackUrl = type === 'influencer' ? '/onboarding' : '/brand/dashboard';
    // signIn('google', { callbackUrl });
    signIn('google', {
      callbackUrl,
      state: JSON.stringify({ userType: type }) // pass userType here
    });
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          {/* Header section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              
              
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Xponsor</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
              Choose your path and unlock the power of authentic partnerships
            </p>
          </div>
          
          {/* Cards container */}
          <div className="space-y-6">
            {/* Brand card */}
            <div 
              className={`group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:bg-white/15 ${
                hoveredCard === 'brand' ? 'shadow-2xl shadow-blue-500/25' : 'shadow-xl'
              }`}
              onClick={() => handleUserTypeSelect('brand')}
              onMouseEnter={() => setHoveredCard('brand')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      I'm a Brand
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      Connect with influential creators and amplify your message
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:translate-x-1">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Influencer card */}
            <div 
              className={`group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:bg-white/15 ${
                hoveredCard === 'influencer' ? 'shadow-2xl shadow-purple-500/25' : 'shadow-xl'
              }`}
              onClick={() => handleUserTypeSelect('influencer')}
              onMouseEnter={() => setHoveredCard('influencer')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      I'm an Influencer
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      Monetize your influence and partner with amazing brands
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:translate-x-1">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm">
              Trusted by thousands of creators and brands worldwide
            </p>
            <div className="flex justify-center items-center mt-4 space-x-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}