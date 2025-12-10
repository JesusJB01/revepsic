import { Suspense } from 'react';
import { getPosts, getTags, Post, Tag } from '@/lib/server-api';
import PageHeader from '@/components/PageHeader';
import BlogFilters from './blog-filters';
import BlogGrid from './blog-grid';
import BlogPagination from './blog-pagination';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - REVEPSIC',
  description: 'Artículos sobre psicología basada en evidencia. Explora investigaciones, tendencias y enfoques innovadores.',
};

interface Props {
  searchParams: Promise<{ page?: string; tag?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const tag = params.tag || '';
  const searchQuery = params.q || '';

  // Fetching paralelo con Promise.all
  const [postsResponse, tagsResponse] = await Promise.all([
    getPosts({
      page,
      limit: 6,
      status: 'PUBLISHED',
      tag: tag || undefined
    }),
    getTags(),
  ]);

  // Extraer datos con manejo seguro
  // Estructura de respuesta: { success: true, data: { data: Post[], pagination: {...} } }
  const responseData = postsResponse?.data;
  let posts: Post[] = [];
  let pagination = { page: 1, totalPages: 1, total: 0, limit: 6 };

  if (responseData) {
    // Si responseData tiene .data (estructura anidada del backend)
    if (responseData.data && Array.isArray(responseData.data)) {
      posts = responseData.data;
      pagination = responseData.pagination || pagination;
    } else if (Array.isArray(responseData)) {
      // Fallback: si responseData es directamente un array
      posts = responseData;
    }
  }

  const tagsData = tagsResponse?.data;
  const tags: Tag[] = Array.isArray(tagsData) ? tagsData : [];

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Artículos sobre psicología basada en evidencia"
        imageSrc="/blog.jpg"
        imageAlt="Blog REVEPSIC"
      />

      <section className="py-12 md:py-16">
        <div className="container">
          {/* Filtros - Client Component para interactividad */}
          <Suspense fallback={<div className="h-12 bg-muted rounded-xl animate-pulse mb-8" />}>
            <BlogFilters
              tags={tags}
              currentTag={tag}
              searchQuery={searchQuery}
            />
          </Suspense>

          {/* Grid de posts - Server rendered */}
          <BlogGrid posts={posts} searchQuery={searchQuery} />

          {/* Paginación - Client Component */}
          {pagination.totalPages > 1 && (
            <BlogPagination
              currentPage={page}
              totalPages={pagination.totalPages}
              currentTag={tag}
            />
          )}
        </div>
      </section>
    </>
  );
}
