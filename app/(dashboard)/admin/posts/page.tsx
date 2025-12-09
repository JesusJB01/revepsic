"use client";
import React, { useEffect, useState } from "react";
import { postsApi, Post, tagsApi, Tag } from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react";

export default function PostsAdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [tagFilter, setTagFilter] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError("");

            try {
                // Fetch tags for filter
                const tagsRes = await tagsApi.getAll();
                if (tagsRes.success && tagsRes.data) {
                    setTags(Array.isArray(tagsRes.data) ? tagsRes.data : []);
                }

                // Fetch posts
                const params: { page: number; limit: number; status?: string; tag?: string } = {
                    page,
                    limit: 10
                };
                if (statusFilter) params.status = statusFilter;
                if (tagFilter) params.tag = tagFilter;

                const response = await postsApi.getAll(params);
                if (response.success && response.data) {
                    // Handle different response structures
                    const postsData = response.data.data || response.data;
                    setPosts(Array.isArray(postsData) ? postsData : []);
                    setTotalPages(response.data.pagination?.totalPages || 1);
                } else {
                    setPosts([]);
                    setError(response.message || "Error al cargar posts");
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Error al cargar los posts");
                setPosts([]);
            }

            setIsLoading(false);
        };
        fetchData();
    }, [page, statusFilter, tagFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este post?")) return;

        const response = await postsApi.delete(id);
        if (response.success) {
            setPosts(posts.filter((p) => p.id !== id));
        }
    };

    const filteredPosts = (posts || []).filter((post) =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Posts</h1>
                    <p className="text-muted-foreground">Gestiona los artículos del blog</p>
                </div>
                <Link
                    href="/admin/posts/nuevo"
                    className="inline-flex items-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Post
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Status filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">Todos los estados</option>
                    <option value="PUBLISHED">Publicados</option>
                    <option value="DRAFT">Borradores</option>
                </select>

                {/* Tag filter */}
                <select
                    value={tagFilter}
                    onChange={(e) => { setTagFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">Todas las categorías</option>
                    {tags.map((tag) => (
                        <option key={tag.id} value={tag.slug}>{tag.name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mx-auto" />
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No se encontraron posts
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Título</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Autor</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Vistas</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fecha</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-foreground line-clamp-1">{post.title}</p>
                                            <p className="text-sm text-muted-foreground">/blog/{post.slug}</p>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {post.author?.name || "Sin autor"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${post.status === "PUBLISHED"
                                                    ? "bg-green-500/10 text-green-500"
                                                    : "bg-amber-500/10 text-amber-500"
                                                    }`}
                                            >
                                                {post.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {post.viewCount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(new Date(post.createdAt), "d MMM yyyy", { locale: es })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="Ver"
                                                >
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                </Link>
                                                <Link
                                                    href={`/admin/posts/${post.slug}/editar`}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4 text-muted-foreground" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-muted rounded-xl disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-muted-foreground">
                        Página {page} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-muted rounded-xl disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
