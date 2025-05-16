// app/brand/layout.js
'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';

export default function BrandLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session) {
    router.push('/');
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/brand/dashboard' },
    { name: 'Browse Influencers', href: '/brand/influencers' },
    { name: 'Your Campaigns', href: '/brand/campaigns' },
    { name: 'Messages', href: '/brand/messages' },
    { name: 'Profile', href: '/brand/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold">Xponsor</h1>
            <p className="text-sm text-gray-600">Brand Portal</p>
          </div>
          <nav className="mt-4">
            <ul>
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-2 text-gray-800 hover:bg-blue-50 ${
                      pathname === item.href ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
            <div className="flex items-center">
              {session.user.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name} 
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                  {session.user.name?.charAt(0) || '?'}
                </div>
              )}
              <div className="text-sm">
                <p className="font-medium">{session.user.name}</p>
                <button 
                  onClick={() => router.push('/api/auth/signout')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
