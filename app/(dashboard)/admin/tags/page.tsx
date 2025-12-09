"use client";
import React, { useEffect, useState } from "react";
import { tagsApi, Tag } from "@/lib/api";
import { Plus, Edit, Trash2, Hash } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";

export default function TagsAdminPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "", description: "" });

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await tagsApi.getAll();
            if (response.success && response.data) {
                setTags(Array.isArray(response.data) ? response.data : []);
            } else {
                setTags([]);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
            setTags([]);
        }
        setIsLoading(false);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleNameChange = (name: string) => {
        setFormData((prev) => ({ ...prev, name, slug: generateSlug(name) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTag) {
            const response = await tagsApi.update(editingTag.id, formData);
            if (response.success) {
                fetchTags();
                closeModal();
            }
        } else {
            const response = await tagsApi.create(formData);
            if (response.success) {
                fetchTags();
                closeModal();
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este tag?")) return;
        const response = await tagsApi.delete(id);
        if (response.success) {
            setTags(tags.filter((t) => t.id !== id));
        }
    };

    const openEditModal = (tag: Tag) => {
        setEditingTag(tag);
        setFormData({ name: tag.name, slug: tag.slug, description: tag.description || "" });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTag(null);
        setFormData({ name: "", slug: "", description: "" });
    };

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Tags / Categorías</h1>
                        <p className="text-muted-foreground">Organiza el contenido del blog</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Nuevo Tag
                    </button>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 bg-card rounded-2xl border border-border animate-pulse">
                                <div className="h-6 w-24 bg-muted rounded mb-2" />
                                <div className="h-4 w-32 bg-muted rounded" />
                            </div>
                        ))}
                    </div>
                ) : !tags || tags.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                        <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No hay tags creados</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(tags || []).map((tag) => (
                            <div
                                key={tag.id}
                                className="p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-5 w-5 text-primary" />
                                        <h3 className="font-semibold text-foreground">{tag.name}</h3>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(tag)}
                                            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                        >
                                            <Edit className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tag.id)}
                                            className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">/blog/categoria/{tag.slug}</p>
                                {tag.postCount !== undefined && (
                                    <p className="text-xs text-muted-foreground mt-2">{tag.postCount} posts</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-foreground mb-6">
                                {editingTag ? "Editar Tag" : "Nuevo Tag"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Nombre</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Slug</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                        required
                                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Descripción</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 bg-muted text-foreground font-medium rounded-xl hover:bg-accent transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all"
                                    >
                                        {editingTag ? "Actualizar" : "Crear"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}
