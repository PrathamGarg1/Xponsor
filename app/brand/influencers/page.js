// app/brand/influencers/page.js
'use client';

import { useState } from 'react';
import { useInfluencers } from '@/hooks/useInfluencers';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Pagination from '@/components/ui/Pagination';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function BrowseInfluencersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filters, setFilters] = useState({
    minFollowers: '',
    maxPrice: '',
    niche: ''
  });
  
  const { influencers, loading, error, updateFilters, page, nextPage, prevPage } = useInfluencers();
  
  if (status === 'loading') {
    return <Loading />;
  }

  if (!session) {
    router.push('/');
    return null;
  }
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const applyFilters = () => {
    updateFilters(filters);
  };

  const handleMessageInfluencer = (influencerId) => {
    router.push(`/brand/messages?userId=${influencerId}`);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Browse Influencers</h1>
      
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Followers</label>
            <input
              type="number"
              name="minFollowers"
              value={filters.minFollowers}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Niche</label>
            <input
              type="text"
              name="niche"
              value={filters.niche}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <Loading />
      ) : error ? (
        <Error message={error} />
      ) : (
        <>
          {influencers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No influencers found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {influencers.map((influencer) => (
                <div key={influencer.user.id} className="bg-white p-4 rounded shadow">
                  <div className="flex items-center mb-4">
                    {influencer.user.image ? (
                      <Image 
                        src={influencer.user.image} 
                        alt={influencer.user.name} 
                        width={50} 
                        height={50} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {influencer.user.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold">{influencer.user.name}</h3>
                      <p className="text-gray-600">
                        {influencer.instagramHandle ? `@${influencer.instagramHandle}` : 'No handle'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-500">Followers</p>
                    <p className="text-lg">{influencer.followerCount.toLocaleString()}</p>
                  </div>
                  
                  {influencer.niche && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-500">Niche</p>
                      <p className="text-lg">{influencer.niche}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Pricing</p>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {influencer.pricePerPost && (
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">Post</p>
                          <p className="font-medium">${influencer.pricePerPost}</p>
                        </div>
                      )}
                      {influencer.pricePerStory && (
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">Story</p>
                          <p className="font-medium">${influencer.pricePerStory}</p>
                        </div>
                      )}
                      {influencer.pricePerReel && (
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">Reel</p>
                          <p className="font-medium">${influencer.pricePerReel}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {influencer.allowMessages && (
                    <button
                      onClick={() => handleMessageInfluencer(influencer.user.id)}
                      className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                    >
                      Message Influencer
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <Pagination
            page={page}
            hasMore={influencers.length === 10}
            onPrevious={prevPage}
            onNext={nextPage}
          />
        </>
      )}
    </div>
  );
}
