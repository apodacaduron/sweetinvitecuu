import { Metadata } from 'next';

import TemplatePage from '@/features/templates/pages/TemplatePage';
import { supabase } from '@/lib/supabase';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const query = await supabase
      .from("templates")
      .select("name")
      .eq("slug", slug)
      .single();

  return {
    title: `${query.data?.name} - Template`,
  };
}

export default function Page({ params }: Props) {
  return <TemplatePage params={params} />;
}
