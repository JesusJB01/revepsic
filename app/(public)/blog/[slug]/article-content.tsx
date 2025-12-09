'use client';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, User, Eye, ArrowLeft } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';
import { FadeIn } from '@/components/animations';
import { Post, estimateReadTime } from '@/lib/blog-utils';

interface Props {
    post: Post;
}

export default function ArticleContent({ post }: Props) {
    return (
        <article className="py-12 md:py-16">
            <div className="container max-w-3xl">
                <FadeIn>
                    {/* Breadcrumbs */}
                    <Breadcrumbs
                        items={[
                            { label: 'Blog', href: '/blog' },
                            { label: post.title },
                        ]}
                    />

                    {/* Header */}
                    <header className="mb-8">
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={`/blog/categoria/${tag.slug}`}
                                        className="text-sm text-primary font-medium hover:underline"
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                            {post.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                            {post.author && (
                                <Link
                                    href={`/blog/autor/${post.author.slug}`}
                                    className="flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    {post.author.avatar ? (
                                        <Image
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <User className="h-5 w-5" />
                                    )}
                                    <span>{post.author.name}</span>
                                </Link>
                            )}

                            {post.publishedAt && (
                                <span>
                                    {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
                                </span>
                            )}

                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {estimateReadTime(post.content)} min de lectura
                            </div>

                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.viewCount} vistas
                            </div>
                        </div>

                        {/* Share */}
                        <ShareButtons title={post.title} />
                    </header>
                </FadeIn>

                <FadeIn delay={0.2}>
                    {/* Featured Image */}
                    {post.coverImage && (
                        <div className="mb-10 rounded-2xl overflow-hidden">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                width={800}
                                height={400}
                                className="w-full h-auto"
                                priority
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                    {/* Author Card */}
                    {post.author && (
                        <div className="mt-12 p-6 bg-card rounded-2xl border border-border">
                            <div className="flex items-start gap-4">
                                <div className="relative h-16 w-16 flex-shrink-0">
                                    {post.author.avatar ? (
                                        <Image
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                                            <User className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{post.author.name}</p>
                                    <Link
                                        href={`/blog/autor/${post.author.slug}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Ver todos sus artículos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Share */}
                    <div className="mt-8 pt-8 border-t border-border">
                        <ShareButtons title={post.title} />
                    </div>

                    {/* Back link */}
                    <div className="mt-8">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al blog
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </article>
    );
}
