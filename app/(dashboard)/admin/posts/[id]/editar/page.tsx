"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { postsApi, uploadApi, Tag, Author, Post } from "@/lib/api";
import { getTagsForForm, getAuthorsForForm } from "@/lib/actions/posts-form";
import { ArrowLeft, Save, Eye, Loader2, ImageIcon, X, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { postSchema } from "@/lib/validations";
import { revalidatePosts } from "@/lib/actions/revalidate";

// Dynamic import for MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postSlug = params.id as string;
    const [postId, setPostId] = useState<string>("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [error, setError] = useState("");
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
            setIsLoading(true);
            setError("");

            try {
                const [tagsData, authorsData, postRes] = await Promise.all([
                    getTagsForForm(),
                    getAuthorsForForm(),
                    postsApi.getBySlug(postSlug),
                ]);

                setTags(Array.isArray(tagsData) ? tagsData as any : []);
                setAuthors(Array.isArray(authorsData) ? authorsData as any : []);

                if (postRes.success && postRes.data) {
                    const post = postRes.data as Post;
                    setPostId(post.id);
                    setFormData({
                        title: post.title || "",
                        slug: post.slug || "",
                        excerpt: post.excerpt || "",
                        content: post.content || "",
                        coverImage: post.coverImage || "",
                        authorId: post.author?.id || "",
                        status: post.status || "DRAFT",
                        isPremium: post.isPremium || false,
                        tagIds: post.tags?.map((t: Tag) => t.id) || [],
                    });
                } else {
                    setError("No se pudo cargar el post");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Error al cargar los datos");
            }

            setIsLoading(false);
        };

        if (postSlug) {
            fetchData();
        }
    }, [postSlug]);

    const handleTitleChange = (title: string) => {
        setFormData((prev) => ({ ...prev, title }));
    };

    const handleTagToggle = (tagId: string) => {
        setFormData((prev) => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter((id) => id !== tagId)
                : [...prev.tagIds, tagId],
        }));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !postId) return;

        // Validate
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast.error("Formato no válido", { description: "Usa JPG, PNG, GIF o WEBP" });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Imagen muy grande", { description: "El tamaño máximo es 5MB" });
            return;
        }

        setIsUploading(true);

        try {
            const response = await uploadApi.uploadCover(postId, file);

            if (response.success && response.data?.url) {
                setFormData((prev) => ({ ...prev, coverImage: response.data!.url }));
                toast.success("Imagen subida correctamente");
            } else {
                toast.error("Error al subir la imagen", { description: response.message });
            }
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Error al subir la imagen");
        }

        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeCoverImage = () => {
        setFormData((prev) => ({ ...prev, coverImage: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate with Zod
        const postData = {
            title: formData.title,
            slug: formData.slug || undefined,
            content: formData.content,
            excerpt: formData.excerpt || undefined,
            authorId: formData.authorId,
            status: formData.status,
            isPremium: formData.isPremium,
            tagIds: formData.tagIds,
            coverImage: formData.coverImage || undefined,
        };

        const validation = postSchema.safeParse(postData);

        if (!validation.success) {
            const firstError = validation.error.issues[0];
            toast.error("Error de validación", {
                description: firstError.message
            });
            return;
        }

        setIsSaving(true);

        // Cast to match API expected types
        const updateData = {
            ...validation.data,
            status: validation.data.status as "DRAFT" | "PUBLISHED",
        };
        const response = await postsApi.update(postId, updateData);

        if (response.success) {
            await revalidatePosts(validation.data.slug);
            toast.success("Post actualizado correctamente");
            router.push("/admin/posts");
        } else {
            toast.error("Error al actualizar el post", { description: response.message });
        }

        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Link href="/admin/posts" className="text-primary hover:underline">
                    Volver a posts
                </Link>
            </div>
        );
    }

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
                    <h1 className="text-3xl font-bold text-foreground">Editar Post</h1>
                    <p className="text-muted-foreground">Modificar artículo existente</p>
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

                            {formData.coverImage ? (
                                <div className="relative rounded-xl overflow-hidden border border-border">
                                    <div className="aspect-video relative">
                                        <Image
                                            src={formData.coverImage}
                                            alt="Cover"
                                            fill
                                            className="object-cover"
                                        />
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                                            </div>
                                        )}
                                    </div>
                                    {!isUploading && (
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
                                    )}
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="w-full aspect-video border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/50 transition-colors disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    ) : (
                                        <>
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
                                        </>
                                    )}
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
                                <Link
                                    href={`/blog/${formData.slug}`}
                                    target="_blank"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-muted text-foreground font-medium rounded-xl hover:bg-accent transition-colors"
                                >
                                    <Eye className="h-4 w-4" />
                                    Ver
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {isSaving ? "Guardando..." : "Guardar"}
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
