import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts, getTagBySlug, Post, estimateReadTime } from '@/lib/server-api';
import { Clock, User, Hash, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

// Genera metadata dinámico para SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const response = await getTagBySlug(slug);

    if (!response?.success || !response.data) {
        return { title: 'Categoría no encontrada - REVEPSIC' };
    }

    const tag = response.data;

    return {
        title: `${tag.name} - REVEPSIC`,
        description: tag.description || `Artículos sobre ${tag.name}`,
        openGraph: {
            title: tag.name,
            description: tag.description || `Artículos sobre ${tag.name}`,
        },
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;

    // Fetching paralelo
    const [tagResponse, postsResponse] = await Promise.all([
        getTagBySlug(slug),
        getPosts({ page, limit: 9, status: 'PUBLISHED', tag: slug }),
    ]);

    const tag = tagResponse?.data || { name: slug, slug, description: '' };
    const postsData = postsResponse?.data;
    const posts: Post[] = Array.isArray(postsData) ? postsData : (postsData?.data || []);
    const pagination = postsData?.pagination || { totalPages: 1 };

    return (
        <>
            <PageHeader
                title={tag.name || 'Categoría'}
                subtitle={tag.description || `Artículos sobre ${tag.name || slug}`}
                imageSrc="/blog.jpg"
                imageAlt={tag.name || 'Categoría'}
            />

            <section className="py-12 md:py-16">
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Blog', href: '/blog' },
                            { label: tag.name || slug },
                        ]}
                    />

                    {/* Posts Grid */}
                    {posts.length === 0 ? (
                        <div className="text-center py-16">
                            <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No hay artículos en esta categoría</p>
                            <Link href="/blog" className="text-primary hover:underline mt-2 inline-block">
                                Ver todos los artículos
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group block bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all"
                                >
                                    <div className="relative h-48 bg-muted overflow-hidden">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {post.author?.name}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {estimateReadTime(post.content)} min
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <Link
                                href={`/blog/categoria/${slug}?page=${Math.max(1, page - 1)}`}
                                className={`px-4 py-2 bg-card border border-border rounded-xl ${page === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                Anterior
                            </Link>
                            <span className="text-muted-foreground px-4">
                                Página {page} de {pagination.totalPages}
                            </span>
                            <Link
                                href={`/blog/categoria/${slug}?page=${Math.min(pagination.totalPages, page + 1)}`}
                                className={`px-4 py-2 bg-card border border-border rounded-xl ${page === pagination.totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                Siguiente
                            </Link>
                        </div>
                    )}

                    {/* Back to blog */}
                    <div className="mt-8">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al blog
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
