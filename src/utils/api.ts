import { useQuery } from '@tanstack/react-query';

const API_URL = 'https://pnqljxlcqfeubrtfrbvv.supabase.co/functions/v1/query-user-completion';
const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucWxqeGxjcWZldWJydGZyYnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzg1MjgsImV4cCI6MjA2MjcxNDUyOH0.3i_FHI-DFUXQUdSOuZFtxdH4GwRzv8FVb-9jD9G7TYM';

export interface UserCompletion {
  // Add your specific types here based on the API response
  [key: string]: any;
}

export const fetchUserCompletion = async (): Promise<UserCompletion[]> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ name: 'Functions' }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data from API');
  }

  return response.json();
};

export const useUserCompletion = () =>
  useQuery<UserCompletion[]>({
    queryKey: ['userCompletion'],
    queryFn: fetchUserCompletion,
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
  });
