"use client";

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const params = useParams();
  const slug = params.slug?.toString()

  const templateQuery = useQuery({
    queryKey: ["template", slug],
    queryFn: async () => {
      if (!slug) throw new Error('Could not load template, slug not provided')

      const query = supabase
        .from("templates")
        .select("*")
        .eq("slug", slug)
        .single()
        .throwOnError();

      const { data } = await query;
      return data ?? [];
    },
  });

  if (templateQuery.isLoading) return <p>Loading...</p>;
  if (templateQuery.error) return <p>Error loading template</p>;

  const DynamicTemplate = dynamic(
    () => import(`@/features/cms/templates/${slug}.tsx`)
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTemplate blocks={templateQuery.data.blocks} />
    </Suspense>
  );
}
