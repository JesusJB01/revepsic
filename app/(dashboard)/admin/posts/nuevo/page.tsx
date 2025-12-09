"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { postsApi, tagsApi, authorsApi, uploadApi, Tag, Author } from "@/lib/api";
import { ArrowLeft, Save, Loader2, ImageIcon, X, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Dynamic import for MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function NewPostPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        authorId: "",
        status: "DRAFT" as "DRAFT" | "PUBLISHED",
        isPremium: false,
        tagIds: [] as string[],
    });

    useEffect(() => {
        const fetchData = async () => {
            const [tagsRes, authorsRes] = await Promise.all([
                tagsApi.getAll(),
                authorsApi.getAll(),
            ]);
            if (tagsRes.success && tagsRes.data) setTags(Array.isArray(tagsRes.data) ? tagsRes.data : []);
            if (authorsRes.success && authorsRes.data) setAuthors(Array.isArray(authorsRes.data) ? authorsRes.data : []);
        };
        fetchData();
    }, []);

    // Auto-generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleTitleChange = (title: string) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }));
    };

    const handleTagToggle = (tagId: string) => {
        setFormData((prev) => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter((id) => id !== tagId)
                : [...prev.tagIds, tagId],
        }));
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

        setCoverFile(file);

        // Preview
        const reader = new FileReader();
        reader.onload = () => setCoverPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const removeCoverImage = () => {
        setCoverFile(null);
        setCoverPreview(null);
        setFormData((prev) => ({ ...prev, coverImage: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            alert("El título es requerido");
            return;
        }
        if (!formData.authorId) {
            alert("Debes seleccionar un autor");
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Create the post - only send fields the API expects
            const postData = {
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt,
                content: formData.content,
                authorId: formData.authorId,
                status: formData.status,
                isPremium: formData.isPremium,
                tagIds: formData.tagIds,
            };
            console.log("Creating post with data:", postData);
            const response = await postsApi.create(postData);

            if (response.success && response.data) {
                const postId = response.data.id;

                // Step 2: Upload cover image if selected
                if (coverFile) {
                    console.log("Uploading cover for post:", postId);
                    const uploadRes = await uploadApi.uploadCover(postId, coverFile);
                    if (!uploadRes.success) {
                        console.error("Failed to upload cover:", uploadRes.message);
                    }
                }

                router.push("/admin/posts");
            } else {
                const errorMsg = response.message || response.error || "Error al crear el post";
                console.error("Error creating post:", errorMsg);
                alert(errorMsg);
            }
        } catch (err) {
            console.error("Submit error:", err);
            alert("Error de conexión. Verifica tu sesión e intenta de nuevo.");
        }

        setIsLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/posts"
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Nuevo Post</h1>
                    <p className="text-muted-foreground">Crear un nuevo artículo</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Título</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Título del artículo"
                                required
                                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Slug (URL)</label>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">/blog/</span>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                    placeholder="url-del-articulo"
                                    required
                                    className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Cover Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Imagen de portada</label>

                            {coverPreview ? (
                                <div className="relative rounded-xl overflow-hidden border border-border">
                                    <div className="aspect-video relative">
                                        <Image
                                            src={coverPreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                                            title="Cambiar imagen"
                                        >
                                            <Upload className="h-4 w-4 text-white" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={removeCoverImage}
                                            className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                                            title="Eliminar imagen"
                                        >
                                            <X className="h-4 w-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full aspect-video border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="p-3 bg-muted rounded-full">
                                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-foreground">
                                            Haz clic para subir imagen
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            JPG, PNG, GIF o WEBP (máx. 5MB)
                                        </p>
                                    </div>
                                </button>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Resumen</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                                placeholder="Breve descripción del artículo..."
                                rows={3}
                                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Contenido</label>
                            <div data-color-mode="dark">
                                <MDEditor
                                    value={formData.content}
                                    onChange={(value) => setFormData((prev) => ({ ...prev, content: value || "" }))}
                                    height={400}
                                    preview="edit"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish settings */}
                        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                            <h3 className="font-semibold text-foreground">Publicación</h3>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Estado</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as "DRAFT" | "PUBLISHED" }))}
                                    className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="DRAFT">Borrador</option>
                                    <option value="PUBLISHED">Publicado</option>
                                </select>
                            </div>

                            {/* Author */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Autor</label>
                                <select
                                    value={formData.authorId}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, authorId: e.target.value }))}
                                    required
                                    className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Seleccionar autor</option>
                                    {(authors || []).map((author) => (
                                        <option key={author.id} value={author.id}>{author.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Premium */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPremium}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, isPremium: e.target.checked }))}
                                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-foreground">Contenido Premium</span>
                            </label>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {isLoading ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                            <h3 className="font-semibold text-foreground">Categorías</h3>
                            <div className="flex flex-wrap gap-2">
                                {(tags || []).map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => handleTagToggle(tag.id)}
                                        className={`px-3 py-1 text-sm rounded-full transition-colors ${formData.tagIds.includes(tag.id)
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
