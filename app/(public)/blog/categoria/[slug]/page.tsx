"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { postsApi, tagsApi, Post, Tag } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, User, Hash } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [posts, setPosts] = useState<Post[]>([]);
    const [tag, setTag] = useState<Tag | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // Fetch tag info
            const tagRes = await tagsApi.getBySlug(slug);
            if (tagRes.success && tagRes.data) {
                setTag(tagRes.data);
            }

            // Fetch posts by tag
            const response = await postsApi.getAll({
                page,
                limit: 9,
                status: "PUBLISHED",
                tag: slug,
            });
            if (response.success && response.data) {
                setPosts(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
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

    return (
        <>
            <PageHeader
                title={tag?.name || "Categoría"}
                subtitle={tag?.description || `Artículos sobre ${tag?.name || slug}`}
                imageSrc="/blog.jpg"
                imageAlt={tag?.name || "Categoría"}
            />

            <section className="py-12 md:py-16">
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: "Blog", href: "/blog" },
                            { label: tag?.name || slug },
                        ]}
                    />

                    {/* Posts Grid */}
                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
                                    <div className="h-48 bg-muted" />
                                    <div className="p-6">
                                        <div className="h-6 w-full bg-muted rounded mb-2" />
                                        <div className="h-4 w-2/3 bg-muted rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16">
                            <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No hay artículos en esta categoría</p>
                            <Link href="/blog" className="text-primary hover:underline mt-2 inline-block">
                                Ver todos los artículos
                            </Link>
                        </div>
                    ) : (
                        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {posts.map((post) => (
                                <StaggerItem key={post.id}>
                                    <Link
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
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
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
                </div>
            </section>
        </>
    );
}
