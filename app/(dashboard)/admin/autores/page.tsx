"use client";
import React, { useEffect, useState, useRef } from "react";
import { authorsApi, uploadApi, Author } from "@/lib/api";
import Image from "next/image";
import { Plus, Edit, Trash2, UserCircle, Upload, X, Loader2 } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";

export default function AuthorsAdminPage() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "", bio: "", email: "" });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await authorsApi.getAll();
            if (response.success && response.data) {
                setAuthors(Array.isArray(response.data) ? response.data : []);
            } else {
                setAuthors([]);
            }
        } catch (error) {
            console.error("Error fetching authors:", error);
            setAuthors([]);
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
        setFormData((prev) => ({ ...prev, name, slug: prev.slug || generateSlug(name) }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            alert("Formato no válido. Usa JPG, PNG, GIF o WEBP.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen es muy grande. Máximo 5MB.");
            return;
        }

        setAvatarFile(file);

        // Preview
        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const removeAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Clean up data - only send non-empty fields
        const authorData: Record<string, string> = {
            name: formData.name,
            slug: formData.slug,
        };
        if (formData.bio) authorData.bio = formData.bio;
        if (formData.email) authorData.email = formData.email;

        console.log("Sending author data:", authorData);

        try {
            if (editingAuthor) {
                // Update existing author
                const response = await authorsApi.update(editingAuthor.id, authorData);
                console.log("Update response:", response);
                if (response.success) {
                    // Upload avatar if selected
                    if (avatarFile) {
                        setIsUploading(true);
                        const uploadRes = await uploadApi.uploadAvatar(editingAuthor.id, avatarFile, 'author');
                        console.log("Upload avatar response:", uploadRes);
                        setIsUploading(false);
                    }
                    fetchAuthors();
                    closeModal();
                } else {
                    alert(response.message || response.error || "Error al actualizar autor");
                }
            } else {
                // Create new author
                const response = await authorsApi.create(authorData);
                console.log("Create response:", response);
                if (response.success && response.data) {
                    // Upload avatar if selected
                    if (avatarFile) {
                        setIsUploading(true);
                        const uploadRes = await uploadApi.uploadAvatar(response.data.id, avatarFile, 'author');
                        console.log("Upload avatar response:", uploadRes);
                        setIsUploading(false);
                    }
                    fetchAuthors();
                    closeModal();
                } else {
                    alert(response.message || response.error || "Error al crear autor");
                }
            }
        } catch (error) {
            console.error("Error saving author:", error);
            alert("Error al guardar autor");
        }

        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este autor?")) return;
        const response = await authorsApi.delete(id);
        if (response.success) {
            setAuthors(authors.filter((a) => a.id !== id));
        }
    };

    const openEditModal = (author: Author) => {
        setEditingAuthor(author);
        setFormData({
            name: author.name,
            slug: author.slug,
            bio: author.bio || "",
            email: author.email || "",
        });
        setAvatarPreview(author.avatarUrl || null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAuthor(null);
        setFormData({ name: "", slug: "", bio: "", email: "" });
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Autores</h1>
                        <p className="text-muted-foreground">Gestiona los autores del blog</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Nuevo Autor
                    </button>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 bg-card rounded-2xl border border-border animate-pulse">
                                <div className="h-16 w-16 mx-auto rounded-full bg-muted mb-4" />
                                <div className="h-5 w-32 mx-auto bg-muted rounded" />
                            </div>
                        ))}
                    </div>
                ) : !authors || authors.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                        <UserCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No hay autores registrados</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(authors || []).map((author) => (
                            <div
                                key={author.id}
                                className="p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all group text-center"
                            >
                                <div className="relative mx-auto w-20 h-20 mb-4">
                                    {author.avatarUrl ? (
                                        <Image
                                            src={author.avatarUrl}
                                            alt={author.name}
                                            fill
                                            className="rounded-full object-cover"
                                            unoptimized
                                            onError={(e) => {
                                                // Hide broken image
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                                            <UserCircle className="h-10 w-10 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-semibold text-foreground mb-1">{author.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">/blog/autor/{author.slug}</p>
                                {author.bio && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">{author.bio}</p>
                                )}

                                <div className="flex justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(author)}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(author.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold text-foreground mb-6">
                                {editingAuthor ? "Editar Autor" : "Nuevo Autor"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Avatar Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Avatar</label>
                                    <div className="flex justify-center">
                                        {avatarPreview ? (
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                                                    <Image
                                                        src={avatarPreview}
                                                        alt="Avatar preview"
                                                        width={96}
                                                        height={96}
                                                        className="object-cover w-full h-full"
                                                        unoptimized={avatarPreview.startsWith("data:")}
                                                    />
                                                </div>
                                                <div className="absolute -top-1 -right-1 flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="p-1.5 bg-muted hover:bg-accent rounded-full transition-colors"
                                                        title="Cambiar"
                                                    >
                                                        <Upload className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={removeAvatar}
                                                        className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-24 h-24 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-muted/50 transition-colors"
                                            >
                                                <UserCircle className="h-8 w-8 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">Subir</span>
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>

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
                                    <label className="text-sm font-medium text-foreground">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Biografía</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
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
                                        disabled={isSaving || isUploading}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {(isSaving || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isSaving ? "Guardando..." : isUploading ? "Subiendo..." : editingAuthor ? "Actualizar" : "Crear"}
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
