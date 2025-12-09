import Link from 'next/link';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';
import { Post, estimateReadTime } from '@/lib/blog-utils';

interface Props {
    posts: Post[];
    searchQuery?: string;
}

export default function BlogGrid({ posts, searchQuery = '' }: Props) {
    // Filtrar por búsqueda client-side si hay query
    const filteredPosts = searchQuery
        ? posts.filter((post) =>
            post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : posts;

    if (filteredPosts.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground">
                    {searchQuery ? 'No se encontraron artículos con esa búsqueda' : 'No hay artículos disponibles'}
                </p>
                {searchQuery && (
                    <Link href="/blog" className="text-primary hover:underline mt-2 inline-block">
                        Ver todos los artículos
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
                <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl"
                >
                    {/* Image */}
                    <div className="relative h-48 bg-muted overflow-hidden">
                        <Image
                            src={post.coverImage?.startsWith('/') ? post.coverImage : '/pbe.jpg'}
                            alt={post.title || 'Artículo'}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
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
            ))}
        </div>
    );
}
