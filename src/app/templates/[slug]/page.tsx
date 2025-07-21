import { Metadata } from 'next';

import TemplatePage from '@/features/templates/pages/TemplatePage';
import { supabase } from '@/lib/supabase';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("templates")
    .select("name, seo_title, seo_description, og_image_url, theme_color, music_url")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return {
      title: "Template",
    };
  }

  return {
    title: data.seo_title || `${data.name} - Template`,
    description: data.seo_description || undefined,
    openGraph: {
      title: data.seo_title || data.name,
      description: data.seo_description || undefined,
      images: data.og_image_url ? [{ url: data.og_image_url }] : undefined,
    },
    twitter: {
      card: data.og_image_url ? "summary_large_image" : "summary",
      title: data.seo_title || data.name,
      description: data.seo_description || undefined,
      images: data.og_image_url ? [data.og_image_url] : undefined,
    },
    // You can add themeColor or music_url here if your Metadata type supports it:
    themeColor: data.theme_color || undefined,
    // You might want to add custom fields for music or handle it in your page components.
  };
}


export default function Page({ params }: Props) {
  return <TemplatePage params={params} />;
}
