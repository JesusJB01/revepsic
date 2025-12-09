'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Tag } from '@/lib/blog-utils';

interface Props {
    tags: Tag[];
    currentTag: string;
    searchQuery: string;
}

export default function BlogFilters({ tags, currentTag, searchQuery }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState(searchQuery);

    // Función para actualizar URL
    const updateURL = useCallback((newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Reset page cuando cambian filtros
        if ('tag' in newParams || 'q' in newParams) {
            params.delete('page');
        }

        startTransition(() => {
            router.push(`/blog?${params.toString()}`);
        });
    }, [searchParams, router]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== searchQuery) {
                updateURL({ q: search || null });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [search, searchQuery, updateURL]);

    const handleTagChange = (tagSlug: string) => {
        updateURL({ tag: tagSlug || null });
    };

    return (
        <div className={`flex flex-col md:flex-row gap-4 mb-8 transition-opacity ${isPending ? 'opacity-60' : ''}`}>
            {/* Search */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => handleTagChange('')}
                    className={`px-4 py-2 text-sm rounded-xl transition-colors ${!currentTag
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Todos
                </button>
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        onClick={() => handleTagChange(tag.slug)}
                        className={`px-4 py-2 text-sm rounded-xl transition-colors ${currentTag === tag.slug
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
