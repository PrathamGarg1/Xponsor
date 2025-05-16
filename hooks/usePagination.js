// hooks/usePagination.js
"use client"

import { useState } from 'react';
import { useFetch } from './useFetch';

export function usePagination(baseUrl, itemsPerPage = 10) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  // Build the URL with pagination parameters and filters
  const buildUrl = () => {
    const url = new URL(baseUrl, window.location.origin);
    
    // Add pagination parameters
    url.searchParams.append('page', page);
    url.searchParams.append('limit', itemsPerPage);
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  };

  const { data, loading, error } = useFetch(buildUrl());

  const nextPage = () => {
    if (data && data.hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    setPage(1); // Reset to first page when filters change
  };

  return {
    data: data?.items || [],
    totalItems: data?.totalItems || 0,
    hasMore: data?.hasMore || false,
    loading,
    error,
    page,
    nextPage,
    prevPage,
    filters,
    updateFilters
  };
}
