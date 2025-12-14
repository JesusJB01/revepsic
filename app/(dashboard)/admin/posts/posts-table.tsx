"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { toast } from "sonner";
import type { Post, PostsPagination } from "@/lib/data/posts";

interface Tag {
    id: string;
    name: string;
    slug: string;
}

interface PostsTableProps {
    initialPosts: Post[];
    initialPagination: PostsPagination;
    tags: Tag[];
    currentPage: number;
    currentStatus: string;
    currentTag: string;
    initialSearchQuery: string;
}

export default function PostsTable({
    initialPosts,
    initialPagination,
    tags,
    currentPage,
    currentStatus,
    currentTag,
    initialSearchQuery,
}: PostsTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState(initialPosts);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Filter posts by search query (client-side for instant feedback)
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Update URL params
    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset to page 1 when changing filters
        if (key !== "page") {
            params.delete("page");
        }
        router.push(`/admin/posts?${params.toString()}`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este post?")) return;

        setIsDeleting(id);

        try {
            // Call API to delete (still needs backend)
            const token = localStorage.getItem("accessToken");
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

            const response = await fetch(`${API_URL}/posts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setPosts(posts.filter((p) => p.id !== id));
                toast.success("Post eliminado correctamente");
            } else {
                toast.error("Error al eliminar el post");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Error de conexión");
        }

        setIsDeleting(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Posts</h1>
                    <p className="text-muted-foreground">
                        {initialPagination.total} artículos en total
                    </p>
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
                    value={currentStatus}
                    onChange={(e) => updateParams("status", e.target.value)}
                    className="px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">Todos los estados</option>
                    <option value="PUBLISHED">Publicados</option>
                    <option value="DRAFT">Borradores</option>
                </select>

                {/* Tag filter */}
                <select
                    value={currentTag}
                    onChange={(e) => updateParams("tag", e.target.value)}
                    className="px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">Todas las categorías</option>
                    {tags.map((tag) => (
                        <option key={tag.id} value={tag.slug}>
                            {tag.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {filteredPosts.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No se encontraron posts
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                        Título
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                        Autor
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                        Vistas
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPosts.map((post) => (
                                    <tr
                                        key={post.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-foreground line-clamp-1">
                                                {post.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                /blog/{post.slug}
                                            </p>
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
                                                {post.status === "PUBLISHED"
                                                    ? "Publicado"
                                                    : "Borrador"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {post.viewCount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(new Date(post.createdAt), "d MMM yyyy", {
                                                locale: es,
                                            })}
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
                                                    disabled={isDeleting === post.id}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
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
            {initialPagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => updateParams("page", String(currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-muted rounded-xl disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-muted-foreground">
                        Página {currentPage} de {initialPagination.totalPages}
                    </span>
                    <button
                        onClick={() => updateParams("page", String(currentPage + 1))}
                        disabled={currentPage === initialPagination.totalPages}
                        className="px-4 py-2 bg-muted rounded-xl disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
