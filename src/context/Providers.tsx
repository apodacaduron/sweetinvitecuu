// app/providers.tsx (Client component)
'use client'
import { ReactNode, useState } from 'react';

import { AuthProvider } from '@/context/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
