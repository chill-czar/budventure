import { useState, useEffect } from 'react';

const queryCache = new Map();

export const useQuery = (key, fetcher, options = {}) => {
  const cacheKey = JSON.stringify(key);
  const [data, setData] = useState(queryCache.get(cacheKey));
  const [loading, setLoading] = useState(!queryCache.has(cacheKey));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetcher();
        queryCache.set(cacheKey, result);
        queryCache.set(`${cacheKey}_timestamp`, Date.now());
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (queryCache.has(cacheKey) && Date.now() - queryCache.get(`${cacheKey}_timestamp`) < (options.staleTime || 5000)) {
      return; // Use cached data
    }

    fetchData();
  }, [cacheKey, fetcher, options.staleTime]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      queryCache.set(cacheKey, result);
      queryCache.set(`${cacheKey}_timestamp`, Date.now());
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};
