"use client";

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const params = useParams();
  const slug = params.slug?.toString()

  const eventQuery = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      if (!slug) throw new Error('Could not load template, slug not provided')

      const query = supabase
        .from("events")
        .select("*, templates(*)")
        .eq("slug", slug)
        .single()
        .throwOnError();

      const { data } = await query;
      return data ?? [];
    },
  });

  if (eventQuery.isLoading) return <p>Loading...</p>;
  if (eventQuery.error) return <p>Error loading template</p>;

  const DynamicTemplate = dynamic(
    () => import(`@/features/cms/templates/${eventQuery.data.templates.slug}.tsx`)
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTemplate blocks={eventQuery.data.blocks} />
    </Suspense>
  );
}
