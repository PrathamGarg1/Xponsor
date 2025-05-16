// hooks/useProfile.js
"use client"

import { useState,useEffect } from 'react';
import { useFetch } from './useFetch';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const profileUrl = user?.userType === 'influencer' 
    ? '/api/influencer/profile'
    : '/api/brand/profile';
  
  const { data, loading, error } = useFetch(profileUrl);
  
  const [formData, setFormData] = useState({});
  
  
  // Corrected: use useEffect instead of useState to update formData when data changes
  useEffect(() => {
    if (data?.profile) {
      setFormData(data.profile);
    }
  }, [data]);

  console.log(data);
  
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Convert numeric inputs to numbers
    let processedValue = value;
    if (type === 'number' && value !== '') {
      processedValue = name.includes('price') ? parseFloat(value) : parseInt(value, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
  };
  
  
  const saveProfile = async () => {
    try {
      const response = await fetch(profileUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setIsEditing(false);
      // Refresh data would happen automatically with SWR, but with our custom hook we'd need to refetch
      window.location.reload(); // Simple approach for now
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  return {
    profile: data?.profile,
    loading,
    error,
    isEditing,
    setIsEditing,
    formData,
    handleChange,
    saveProfile
  };
}
