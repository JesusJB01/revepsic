import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAuthorBySlug, getAuthorPosts, Post, estimateReadTime } from '@/lib/server-api';
import { Clock, User, ArrowLeft } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

// Genera metadata dinámico para SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const response = await getAuthorBySlug(slug);

    if (!response?.success || !response.data) {
        return { title: 'Autor no encontrado - REVEPSIC' };
    }

    const author = response.data;

    return {
        title: `${author.name} - REVEPSIC`,
        description: author.bio || `Artículos escritos por ${author.name}`,
        openGraph: {
            title: author.name,
            description: author.bio,
            type: 'profile',
            images: author.avatar ? [author.avatar] : [],
        },
    };
}

export default async function AuthorPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;

    // Fetching paralelo
    const [authorResponse, postsResponse] = await Promise.all([
        getAuthorBySlug(slug),
        getAuthorPosts(slug, page),
    ]);

    if (!authorResponse?.success || !authorResponse.data) {
        notFound();
    }

    const author = authorResponse.data;
    const postsData = postsResponse?.data;
    const posts: Post[] = postsData?.data || [];
    const pagination = postsData?.pagination || { totalPages: 1 };

    return (
        <section className="py-12 md:py-16">
            <div className="container max-w-4xl">
                <Breadcrumbs
                    items={[
                        { label: 'Blog', href: '/blog' },
                        { label: author.name },
                    ]}
                />

                {/* Author Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 p-8 bg-card rounded-2xl border border-border">
                    <div className="relative h-24 w-24 flex-shrink-0">
                        {author.avatar ? (
                            <Image
                                src={author.avatar}
                                alt={author.name}
                                fill
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                                <User className="h-12 w-12 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-foreground mb-2">{author.name}</h1>
                        {author.bio && (
                            <p className="text-muted-foreground max-w-xl">{author.bio}</p>
                        )}
                    </div>
                </div>

                {/* Posts */}
                <h2 className="text-xl font-bold text-foreground mb-6">
                    Artículos de {author.name}
                </h2>

                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Este autor aún no tiene artículos publicados</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
                            >
                                {post.coverImage && (
                                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
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
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <Link
                            href={`/blog/autor/${slug}?page=${Math.max(1, page - 1)}`}
                            className={`px-4 py-2 bg-card border border-border rounded-xl ${page === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            Anterior
                        </Link>
                        <span className="text-muted-foreground px-4">
                            Página {page} de {pagination.totalPages}
                        </span>
                        <Link
                            href={`/blog/autor/${slug}?page=${Math.min(pagination.totalPages, page + 1)}`}
                            className={`px-4 py-2 bg-card border border-border rounded-xl ${page === pagination.totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            Siguiente
                        </Link>
                    </div>
                )}

                {/* Back Link */}
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
    );
}
