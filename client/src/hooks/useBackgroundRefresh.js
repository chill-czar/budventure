import { useEffect } from 'react';

export const useBackgroundRefresh = (refetchFunction, interval = 30000) => {
  useEffect(() => {
    const intervalId = setInterval(refetchFunction, interval);
    return () => clearInterval(intervalId);
  }, [refetchFunction, interval]);
};
