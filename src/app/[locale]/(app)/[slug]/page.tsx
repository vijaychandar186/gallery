import { notFound } from 'next/navigation';
import { GALLERY_MAP } from '@/config/gallery';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = GALLERY_MAP[slug];
  if (!project) notFound();
  return <project.Page />;
}

export async function generateStaticParams() {
  const { GALLERY_PROJECTS } = await import('@/config/gallery');
  return GALLERY_PROJECTS.map((p) => ({ slug: p.slug }));
}
