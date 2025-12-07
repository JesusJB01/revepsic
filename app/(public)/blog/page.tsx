"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { postsApi, tagsApi, Post, Tag } from "@/lib/api";
import { Clock, User, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

// Cache for tags to avoid refetching
let tagsCache: Tag[] | null = null;

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>(tagsCache || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTag, setActiveTag] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data with parallel requests
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Fetch tags only if not cached
        const tagsPromise = tagsCache
          ? Promise.resolve({ success: true, data: tagsCache })
          : tagsApi.getAll();

        // Fetch posts
        const params: { page: number; limit: number; status: string; tag?: string } = {
          page,
          limit: 6, // Reduced for faster loading
          status: "PUBLISHED",
        };
        if (activeTag) params.tag = activeTag;
        const postsPromise = postsApi.getAll(params);

        // Parallel fetch
        const [tagsRes, postsRes] = await Promise.all([tagsPromise, postsPromise]);

        if (tagsRes.success && tagsRes.data) {
          const tagsData = Array.isArray(tagsRes.data) ? tagsRes.data : [];
          tagsCache = tagsData; // Cache tags
          setTags(tagsData);
        }

        if (postsRes.success && postsRes.data) {
          const postsData = postsRes.data.data || postsRes.data;
          setPosts(Array.isArray(postsData) ? postsData : []);
          setTotalPages(postsRes.data.pagination?.totalPages || 1);
        } else {
          setPosts([]);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error fetching blog data:", err);
          setError("Error al cargar los artículos.");
          setPosts([]);
        }
      }

      setIsLoading(false);
    };

    fetchData();
    return () => controller.abort();
  }, [page, activeTag]);

  // Memoized filtered posts
  const filteredPosts = useMemo(() =>
    posts.filter((post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [posts, searchQuery]);

  // Memoized read time calculation
  const estimateReadTime = useCallback((content: string) => {
    if (!content) return 1;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  }, []);

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
          {/* Filters */}
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setActiveTag(""); setPage(1); }}
                  className={`px-4 py-2 text-sm rounded-xl transition-colors ${!activeTag
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Todos
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => { setActiveTag(tag.slug); setPage(1); }}
                    className={`px-4 py-2 text-sm rounded-xl transition-colors ${activeTag === tag.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-6">
                    <div className="h-4 w-20 bg-muted rounded mb-3" />
                    <div className="h-6 w-full bg-muted rounded mb-2" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                Reintentar
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No se encontraron artículos</p>
            </div>
          ) : (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <StaggerItem key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <Image
                        src={post.coverImage?.startsWith('/') ? post.coverImage : `/pbe.jpg`}
                        alt={post.title || "Artículo"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIRAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzLT9Tt9Ji04W+ntKZWVpZJpWUbVGQAAM5wPtKUqN8HZQB9yboj/Z/9k="
                      />
                      {post.isPremium && (
                        <span className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                          Premium
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag.id} className="text-xs text-primary font-medium">
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
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
            <FadeIn delay={0.3}>
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-card border border-border rounded-xl disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  Anterior
                </button>
                <span className="text-muted-foreground px-4">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-card border border-border rounded-xl disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </>
  );
}
