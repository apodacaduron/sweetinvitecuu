"use client";

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

type Props = {
  params: Promise<{ slug: string }>;
};


export default function TemplatePage({ params }: Props) {
    const { slug } = React.use(params)

  const templateQuery = useQuery({
    queryKey: ["template", slug?.toString()],
    queryFn: async () => {
      if (!slug?.toString()) throw new Error('Could not load template, slug not provided')

      const query = supabase
        .from("templates")
        .select("*")
        .eq("slug", slug.toString())
        .single()
        .throwOnError();

      const { data } = await query;
      return data ?? [];
    },
    enabled: Boolean(slug?.toString())
  });

  if (templateQuery.isLoading) return <p>Loading...</p>;
  if (templateQuery.error) return <p>Error loading template</p>;
  if (!templateQuery.data?.blocks) return <p>Loading blocks</p>;

  const DynamicTemplate = dynamic(
    () => import(`@/features/cms/templates/${slug.toString()}.tsx`)
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTemplate blocks={templateQuery.data.blocks} />
    </Suspense>
  );
}
