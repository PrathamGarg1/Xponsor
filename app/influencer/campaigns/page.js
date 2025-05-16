// app/influencer/campaigns/page.js
'use client';
import { sendDirectMessage } from '@/hooks/useMessages';
import { useState } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Pagination from '@/components/ui/Pagination';
import { useRouter } from 'next/navigation';

export default function CampaignsPage() {
  const [filters, setFilters] = useState({
    minimumPayout: '',
    minimumFollowers: ''
  });
  
  const router = useRouter();
  // Pass initial filters to useCampaigns hook
  const { campaigns, loading, error, updateFilters, page, nextPage, prevPage } = useCampaigns(filters);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const applyFilters = () => {
    console.log("Applying filters:", filters);
    updateFilters(filters);
  };
  
  if (error) {
    return <Error message={error} />;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Brand Campaigns</h1>
      
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Payout</label>
            <input
              type="number"
              name="minimumPayout"
              value={filters.minimumPayout}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Followers</label>
            <input
              type="number"
              name="minimumFollowers"
              value={filters.minimumFollowers}
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
      ) : (
        <>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No campaigns found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              

              {campaigns.map(campaign => (
                <div key={campaign.id} className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">{campaign.title}</h3>
                  <p className="text-gray-600 mb-2">{campaign.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Min Payout: ${campaign.minimumPayout}</span>
                    <span>Min Followers: {campaign.minimumFollowers}</span>
                  </div>
                  {campaign.allowDirectMessages && (
                    <button 
                      className="mt-3 w-full bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={async () => {
                        try {
                          const initialMessage = `Hi, I'm interested in your ${campaign.title} campaign.`;
                          console.log("Sending message to brand ID:", campaign.brandId);
                          
                          const result = await sendDirectMessage(campaign.brandId, initialMessage);
                          console.log("Message send result:", result);
                    
                          if (result.success) {
                            // Redirect to messages page with this brand selected
                            router.push(`/influencer/messages?userId=${campaign.brandId}`);
                          } else {
                            // Show error message
                            alert(result.error || 'Failed to send message. Please try again.');
                          }
                        } catch (error) {
                          console.error("Error sending message:", error);
                          alert("Failed to send message. Please try again.");
                        }
                      }}
                    >
                      Message Brand
                    </button>
                  )}
                </div>
              ))}

            </div>
          )}
          
          <Pagination
            page={page}
            hasMore={campaigns.length === 10} // Simple approach, assuming if we got 10 items there might be more
            onPrevious={prevPage}
            onNext={nextPage}
          />
        </>
      )}
    </div>
  );
}
