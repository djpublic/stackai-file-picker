"use client";

// app/providers.tsx - Client-side providers for the application
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each user session
  // This prevents data leakage between different users in server environments
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Reduce background refetching for better performance
            staleTime: 60000, // 1 minute
            gcTime: 600000, // 10 minutes (previously cacheTime)
            retry: 1, // Only retry failed requests once
            refetchOnWindowFocus: true, // Refetch when user returns to tab
          },
          mutations: {
            // Global error handling for mutations can be added here
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={true} />
      )}
    </QueryClientProvider>
  );
}
