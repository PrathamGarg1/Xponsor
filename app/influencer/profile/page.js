// app/influencer/profile/page.js
'use client';

import { useProfile } from '@/hooks/useProfile';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

export default function ProfilePage() {
  const {
    profile,
    loading,
    error,
    isEditing,
    setIsEditing,
    formData,
    handleChange,
    saveProfile
  } = useProfile();
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <Error message={error} />;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      
      <div className="bg-white p-6 rounded shadow">
        {!isEditing ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Profile Details</h2>
              <p className="text-gray-600">Manage your influencer profile information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Follower Count</p>
                <p className="text-lg">{profile?.followerCount || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Instagram Handle</p>
                <p className="text-lg">{profile?.instagramHandle || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Niche</p>
                <p className="text-lg">{profile?.niche || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Allow Messages</p>
                <p className="text-lg">{profile?.allowMessages ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Price per Post</p>
                  <p className="text-lg">${profile?.pricePerPost || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price per Story</p>
                  <p className="text-lg">${profile?.pricePerStory || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price per Reel</p>
                  <p className="text-lg">${profile?.pricePerReel || 'Not set'}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Public Profile Link</h3>
              <p className="text-blue-500 underline">{profile?.publicLink}</p>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <p className="text-gray-600">Update your influencer profile information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Follower Count</label>
                <input
                  type="number"
                  name="followerCount"
                  value={formData.followerCount || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instagram Handle</label>
                <input
                  type="text"
                  name="instagramHandle"
                  value={formData.instagramHandle || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Niche</label>
                <input
                  type="text"
                  name="niche"
                  value={formData.niche || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allowMessages"
                  checked={formData.allowMessages || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Allow Messages</label>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price per Post</label>
                  <input
                    type="number"
                    name="pricePerPost"
                    value={formData.pricePerPost || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price per Story</label>
                  <input
                    type="number"
                    name="pricePerStory"
                    value={formData.pricePerStory || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price per Reel</label>
                  <input
                    type="number"
                    name="pricePerReel"
                    value={formData.pricePerReel || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Profile
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
