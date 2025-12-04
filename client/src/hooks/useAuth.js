import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { authAPI } from '../api/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Cached user state with localStorage persistence
  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;

      try {
        const response = await authAPI.getMe();
        return response.data;
      } catch (error) {
        // Invalid token, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    },
    staleTime: Infinity,  // Cache until manual invalidation
    retry: false,         // Don't retry auth failures
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const { token, user: userData } = response.data;

      // Persist to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update cache
      queryClient.setQueryData(['auth', 'user'], userData);
    },
    onError: () => {
      // Clear any stale data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      const { token, user: userData } = response.data;

      // Persist to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update cache
      queryClient.setQueryData(['auth', 'user'], userData);
    },
    onError: () => {
      // Clear any stale data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  });

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.setQueryData(['auth', 'user'], null);
    queryClient.clear();  // Clear all cached data on logout
  }, [queryClient]);

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
