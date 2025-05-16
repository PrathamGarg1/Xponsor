// app/brand/profile/page.js
'use client';

import { useProfile } from '@/hooks/useProfile';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

export default function BrandProfilePage() {
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
      <h1 className="text-2xl font-bold mb-4">Brand Profile</h1>
      
      <div className="bg-white p-6 rounded shadow">
        {!isEditing ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Profile Details</h2>
              <p className="text-gray-600">Manage your brand information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Company Name</p>
                <p className="text-lg">{profile?.companyName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Industry</p>
                <p className="text-lg">{profile?.industry || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Website</p>
                <p className="text-lg">{profile?.website || 'Not set'}</p>
              </div>
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
              <p className="text-gray-600">Update your brand information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
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
