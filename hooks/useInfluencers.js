// hooks/useInfluencers.js
"use client"

import { useState } from 'react';
import { useFetch } from './useFetch';

export function useInfluencers(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Build query string from filters
  const queryString = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  const paginationString = `page=${page}&limit=${limit}`;
  const url = `/api/influencers?${queryString}&${paginationString}`;
  
  const { data, loading, error } = useFetch(url);
  
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };
  
  const nextPage = () => {
    if (data && data.influencers && data.influencers.length === limit) {
      setPage(p => p + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  };
  
  return {
    influencers: data?.influencers || [],
    loading,
    error,
    filters,
    updateFilters,
    page,
    nextPage,
    prevPage
  };
}
