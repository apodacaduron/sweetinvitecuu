"use client";

import 'aos/dist/aos.css';

import AOS from 'aos';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import React, { Suspense, useEffect } from 'react';

import { Block, BlocksProvider } from '@/features/cms/context/BlocksContext';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

type Props = {
  params: Promise<{ slug: string }>;
};

export default function TemplatePage({ params }: Props) {
  const { slug } = React.use(params);
  const templateSlug = slug?.toString();
  const { setTheme } = useTheme();

  useEffect(() => {
    // Force light theme
    setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    AOS.init({
      duration: 800, // duration of animations in ms
      once: true, // animate only once
    });
  }, []);

  const templateQuery = useQuery({
    queryKey: ["template", { slug: templateSlug }],
    queryFn: async () => {
      if (!templateSlug)
        throw new Error("Could not load template, slug not provided");

      const query = supabase
        .from("templates")
        .select("*")
        .eq("slug", templateSlug)
        .single()
        .throwOnError();

      const { data } = await query;
      return data ?? [];
    },
    enabled: Boolean(templateSlug),
  });

  if (templateQuery.isLoading) return <p>Loading...</p>;
  if (templateQuery.error) return <p>Error loading template</p>;
  if (!templateQuery.data?.blocks) return <p>Loading blocks</p>;

  const DynamicTemplate = dynamic<{ blocks: Block[] }>(
    () => import(`@/features/cms/templates/${slug.toString()}.tsx`)
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlocksProvider parentData={templateQuery.data} origin="templates">
        <DynamicTemplate
          blocks={templateQuery.data.blocks as unknown as Block[]}
        />
      </BlocksProvider>
    </Suspense>
  );
}
