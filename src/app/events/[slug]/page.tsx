import { Metadata } from 'next';

import EventPage from '@/features/events/pages/EventPage';
import { supabase } from '@/lib/supabase';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: event } = await supabase
    .from("events")
    .select("title")
    .eq("slug", slug)
    .single();

  return {
    title: event?.title ?? "Evento",
  };
}

export default function Page({ params }: Props) {
  return <EventPage params={params} />;
}