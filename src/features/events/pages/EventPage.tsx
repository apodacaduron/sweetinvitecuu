"use client";

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

type Props = {
  params: Promise<{ slug: string }>;
};


export default function EventPage({ params }: Props) {
    const {slug} = React.use(params)

  const eventQuery = useQuery({
    queryKey: ["event", slug.toString()],
    queryFn: async () => {
      if (!slug.toString()) throw new Error("Could not load event, slug not provided");

      const query = supabase
        .from("events")
        .select("*, templates(*)")
        .eq("slug", slug.toString())
        .single()
        .throwOnError();

      const { data } = await query;
      return data ?? [];
    },
  });

  if (eventQuery.isLoading) return <p>Loading...</p>;
  if (eventQuery.error) return <p>Error loading template</p>;

  const DynamicTemplate = dynamic(
    () =>
      import(`@/features/cms/templates/${eventQuery.data.templates.slug}.tsx`)
  );

  return (
    <Suspense fallback={<div>Loading template...</div>}>
      <DynamicTemplate blocks={eventQuery.data.blocks} />
    </Suspense>
  );
}
