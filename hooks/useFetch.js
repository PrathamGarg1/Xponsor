// hooks/useFetch.js
"use client"

import { useState, useEffect } from 'react';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use AbortController for cleanup. This is the modern replacement for the isMounted flag.
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      // Reset state for each new request
      setLoading(true);
      setData(null);
      setError(null);

      try {
        const response = await fetch(url, { ...options, signal });

        if (!response.ok) {
          // Provide a more descriptive error message
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Handle cases where the response is successful but has no body (e.g., 204 No Content)
        if (response.status === 204) {
          setData(null); // Explicitly set data to null as there is no content
          return;
        }
        
        const result = await response.json();
        setData(result);

      } catch (err) {
        // Don't set an error state if the fetch was aborted by the cleanup function
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        // Only set loading to false if the request was not aborted
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (url) {
      fetchData();
    } else {
      setLoading(false); // If no URL is provided, don't attempt to fetch
    }

    // Cleanup function: This aborts the fetch request if the component unmounts
    // or if the dependencies (url, options) change before the request completes.
    return () => {
      controller.abort();
    };
  }, [url, JSON.stringify(options)]); // Dependency array is correct

  return { data, loading, error };
}
