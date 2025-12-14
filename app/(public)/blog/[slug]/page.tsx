import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, preloadPost } from '@/lib/server-api';
import ArticleContent from './article-content';

interface Props {
  params: Promise<{ slug: string }>;
}

// Genera metadata dinámico para SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const response = await getPostBySlug(slug);

  if (!response?.success || !response.data) {
    return {
      title: 'Artículo no encontrado - REVEPSIC',
      description: 'El artículo que buscas no existe o ha sido eliminado.',
    };
  }

  const post = response.data;

  return {
    title: `${post.title} - REVEPSIC`,
    description: post.excerpt || post.metaDescription || 'Artículo de psicología basada en evidencia',
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.metaDescription || undefined,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      authors: post.author ? [post.author.name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.metaDescription || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Preload para optimización
  preloadPost(slug);

  const response = await getPostBySlug(slug);

  if (!response?.success || !response.data) {
    notFound();
  }

  return <ArticleContent post={response.data} />;
}
