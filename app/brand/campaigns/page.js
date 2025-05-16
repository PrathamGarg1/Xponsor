// app/brand/campaigns/page.js
'use client';

import { useState } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CampaignsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { campaigns, loading, error } = useCampaigns();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minimumFollowers: 1000,
    minimumPayout: 100,
    allowDirectMessages: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  if (status === 'loading') {
    return <Loading />;
  }

  if (!session) {
    router.push('/');
    return null;
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.title || !formData.description) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }
      
      // Reset form and hide it
      setFormData({
        title: '',
        description: '',
        minimumFollowers: 1000,
        minimumPayout: 100,
        allowDirectMessages: true
      });
      setShowCreateForm(false);
      
      // Refresh the page to show the new campaign
      window.location.reload();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }
      
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Campaigns</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancel' : 'Create New Campaign'}
        </button>
      </div>
      
      {showCreateForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Campaign</h2>
          
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Campaign Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Payout ($)*</label>
                <input
                  type="number"
                  name="minimumPayout"
                  value={formData.minimumPayout}
                  onChange={handleChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Followers*</label>
                <input
                  type="number"
                  name="minimumFollowers"
                  value={formData.minimumFollowers}
                  onChange={handleChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allowDirectMessages"
                  checked={formData.allowDirectMessages}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Allow Direct Messages</label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Campaign Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </button>
          </form>
        </div>
      )}
      
      {loading ? (
        <Loading />
      ) : error ? (
        <Error message={error} />
      ) : (
        <>
          {campaigns.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-gray-500">You haven't created any campaigns yet.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create Your First Campaign
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white p-6 rounded shadow">
                  <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                  <p className="text-gray-600 mb-4">{campaign.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Minimum Payout</p>
                      <p className="text-lg">${campaign.minimumPayout}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Minimum Followers</p>
                      <p className="text-lg">{campaign.minimumFollowers.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Direct Messages</p>
                    <p className="text-lg">{campaign.allowDirectMessages ? 'Allowed' : 'Not Allowed'}</p>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => router.push(`/brand/campaigns/${campaign.id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
