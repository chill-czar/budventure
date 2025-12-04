import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5min - data considered fresh
      gcTime: 10 * 60 * 1000,      // 10min - cache lifetime
      retry: 1,                     // Retry failed requests once
      refetchOnWindowFocus: false,  // Performance optimization
    },
    mutations: {
      retry: false,  // No retry for mutations, let user handle
    },
  },
});

export const QueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
  </QueryClientProvider>
);
