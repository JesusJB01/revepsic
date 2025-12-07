"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authorsApi, Author, Post } from "@/lib/api";
import { Clock, User, ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

export default function AuthorPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [author, setAuthor] = useState<Author | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // Fetch author info
            const authorRes = await authorsApi.getBySlug(slug);
            if (authorRes.success && authorRes.data) {
                setAuthor(authorRes.data);
            }

            // Fetch author's posts
            const postsRes = await authorsApi.getPosts(slug, page);
            if (postsRes.success && postsRes.data) {
                setPosts(postsRes.data.data);
                setTotalPages(postsRes.data.pagination.totalPages);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [slug, page]);

    const estimateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    if (isLoading) {
        return (
            <div className="py-16">
                <div className="container max-w-4xl animate-pulse">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="h-24 w-24 rounded-full bg-muted" />
                        <div>
                            <div className="h-8 w-48 bg-muted rounded mb-2" />
                            <div className="h-4 w-64 bg-muted rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!author) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">Autor no encontrado</h1>
                <Link href="/blog" className="text-primary hover:underline">
                    Volver al blog
                </Link>
            </div>
        );
    }

    return (
        <section className="py-12 md:py-16">
            <div className="container max-w-4xl">
                <Breadcrumbs
                    items={[
                        { label: "Blog", href: "/blog" },
                        { label: author.name },
                    ]}
                />

                <FadeIn>
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
                </FadeIn>

                {/* Posts */}
                <FadeIn delay={0.2}>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                        Artículos de {author.name}
                    </h2>
                </FadeIn>

                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Este autor aún no tiene artículos publicados</p>
                    </div>
                ) : (
                    <StaggerContainer className="space-y-4">
                        {posts.map((post) => (
                            <StaggerItem key={post.id}>
                                <Link
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
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-card border border-border rounded-xl disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-muted-foreground px-4">
                            Página {page} de {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-card border border-border rounded-xl disabled:opacity-50"
                        >
                            Siguiente
                        </button>
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
