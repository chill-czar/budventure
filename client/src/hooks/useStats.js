import { useQuery } from '@tanstack/react-query';
import { statsAPI } from '../api/stats';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => statsAPI.getTaskStats(),
    staleTime: 30 * 1000,        // Cache for 30s after fetch
    refetchInterval: 60 * 1000,   // Auto-refresh every 60s
    refetchIntervalInBackground: true,  // Refresh even when tab inactive
    retry: 2,                      // Retry failed requests twice
  });
};
