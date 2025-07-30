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

export default function EventPage({ params }: Props) {
  const { slug } = React.use(params);
  const eventSlug = slug?.toString();
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

  const eventQuery = useQuery({
    queryKey: ["event", { slug: eventSlug }],
    queryFn: async () => {
      if (!eventSlug)
        throw new Error("Could not load event, slug not provided");

      const query = supabase
        .from("events")
        .select("*, templates(*)")
        .eq("slug", eventSlug)
        .single()
        .throwOnError();

      const { data } = await query;
      return data ?? [];
    },
  });

  if (eventQuery.isLoading) return <p>Loading...</p>;
  if (eventQuery.error) return <p>Error loading template</p>;

  const DynamicTemplate = dynamic<{ blocks: Block[] }>(
    () =>
      import(`@/features/cms/templates/${eventQuery.data?.templates?.slug}.tsx`)
  );

  return (
    <Suspense fallback={<div>Loading template...</div>}>
      <BlocksProvider parentData={eventQuery.data} origin="events">
        <DynamicTemplate
          blocks={eventQuery.data?.blocks as unknown as Block[]}
        />
      </BlocksProvider>
    </Suspense>
  );
}
