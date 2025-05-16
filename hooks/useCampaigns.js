// hooks/useCampaigns.js
"use client"
import { useState, useEffect } from 'react';
import { useFetch } from './useFetch';

export function useCampaigns(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Build query string from filters
  const queryString = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  const paginationString = `page=${page}&limit=${limit}`;
  // Only add & if queryString is not empty
  const url = `/api/campaigns?${queryString}${queryString ? '&' : ''}${paginationString}`;
  
  // Debug what's being sent to API
  useEffect(() => {
    console.log("Campaign filters:", filters);
    console.log("Campaign URL:", url);
  }, [filters, url]);
  
  const { data, loading, error } = useFetch(url);
  
  const updateFilters = (newFilters) => {
    console.log("Updating filters to:", newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };
  
  const nextPage = () => {
    if (data && data.campaigns && data.campaigns.length === limit) {
      setPage(p => p + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  };
  
  return {
    campaigns: data?.campaigns || [],
    loading,
    error,
    filters,
    updateFilters,
    page,
    nextPage,
    prevPage
  };
}
