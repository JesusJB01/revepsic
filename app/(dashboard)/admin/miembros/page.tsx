"use client";
import React, { useEffect, useState, useRef } from "react";
import { membersApi, uploadApi, Member, MemberCategory, CreateMemberDto } from "@/lib/api";
import Image from "next/image";
import { Plus, Edit, Trash2, UserCircle, Upload, X, Loader2, ToggleLeft, ToggleRight, Users, Award, Star } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";

const CATEGORIES: { value: MemberCategory; label: string; icon: React.ReactNode }[] = [
    { value: "FUNDADORES", label: "Fundador", icon: <Award className="h-4 w-4" /> },
    { value: "TITULARES", label: "Titular", icon: <Star className="h-4 w-4" /> },
    { value: "ASOCIADOS", label: "Asociado", icon: <Users className="h-4 w-4" /> },
];

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/200.jpg";

export default function MembersAdminPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [formData, setFormData] = useState<CreateMemberDto>({
        name: "",
        position: "",
        category: "ASOCIADOS",
        bio: "",
        image: PLACEHOLDER_IMAGE,
        whatsapp: "",
        website: "",
        facebook: "",
        instagram: "",
        twitter: "",
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [filterCategory, setFilterCategory] = useState<MemberCategory | "ALL">("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            // Use admin endpoint to get all members (including inactive)
            const response = await membersApi.getAllAdmin();
            if (response.success && response.data) {
                setMembers(Array.isArray(response.data) ? response.data : []);
            } else {
                setMembers([]);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
            setMembers([]);
        }
        setIsLoading(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            alert("Formato no válido. Usa JPG, PNG, GIF o WEBP.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen es muy grande. Máximo 5MB.");
            return;
        }

        setPhotoFile(file);
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const cleanFormData = (data: CreateMemberDto): CreateMemberDto => {
        const cleaned: CreateMemberDto = {
            name: data.name.trim(),
            position: data.position.trim(),
            category: data.category,
            bio: data.bio.trim(),
            image: data.image,
        };

        // WhatsApp: international format (+XXXXXXXXXX)
        if (data.whatsapp?.trim()) {
            let whatsapp = data.whatsapp.trim().replace(/[\s-]/g, '');
            // Add + prefix if missing
            if (!whatsapp.startsWith('+')) {
                whatsapp = '+' + whatsapp;
            }
            cleaned.whatsapp = whatsapp;
        }

        if (data.website?.trim()) cleaned.website = data.website.trim();
        if (data.facebook?.trim()) cleaned.facebook = data.facebook.trim();
        if (data.instagram?.trim()) cleaned.instagram = data.instagram.trim();
        if (data.twitter?.trim()) cleaned.twitter = data.twitter.trim();
        return cleaned;
    };

    // Revalidate cache after member changes (uses secure internal endpoint)
    const revalidateMembers = async (slug?: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            await fetch("/api/admin/revalidate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                },
                body: JSON.stringify({ type: "member", slug }),
            });
        } catch (error) {
            // Non-blocking - cache will eventually refresh
            console.error("Failed to revalidate:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.name.trim().length < 2) {
            alert("El nombre debe tener al menos 2 caracteres");
            return;
        }
        if (formData.position.trim().length < 2) {
            alert("El cargo debe tener al menos 2 caracteres");
            return;
        }
        if (formData.bio.trim().length < 10) {
            alert("La biografía debe tener al menos 10 caracteres");
            return;
        }

        setIsSaving(true);
        const cleanedData = cleanFormData(formData);

        try {
            if (editingMember) {
                const response = await membersApi.update(editingMember.id, cleanedData);
                if (response.success) {
                    if (photoFile) {
                        setIsUploading(true);
                        await uploadApi.uploadMemberPhoto(editingMember.id, photoFile);
                        setIsUploading(false);
                    }
                    await revalidateMembers(editingMember.slug);
                    fetchMembers();
                    closeModal();
                } else {
                    alert(response.message || "Error al actualizar miembro");
                }
            } else {
                const response = await membersApi.create(cleanedData);
                if (response.success && response.data) {
                    if (photoFile) {
                        setIsUploading(true);
                        await uploadApi.uploadMemberPhoto(response.data.id, photoFile);
                        setIsUploading(false);
                    }
                    await revalidateMembers();
                    fetchMembers();
                    closeModal();
                } else {
                    alert(response.message || "Error al crear miembro");
                }
            }
        } catch (error) {
            console.error("Error saving member:", error);
            alert("Error al guardar miembro");
        }

        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este miembro?")) return;
        try {
            const response = await membersApi.delete(id);
            if (response.success) {
                await revalidateMembers();
                fetchMembers();
            } else {
                alert(response.message || "Error al eliminar miembro");
            }
        } catch (error) {
            console.error("Error deleting member:", error);
            alert("Error al eliminar miembro");
        }
    };

    const handleToggle = async (id: string) => {
        try {
            const response = await membersApi.toggle(id);
            if (response.success) {
                await revalidateMembers();
                fetchMembers();
            } else {
                alert(response.message || "Error al cambiar estado");
            }
        } catch (error) {
            console.error("Error toggling member:", error);
            alert("Error al cambiar estado del miembro");
        }
    };

    const openEditModal = (member: Member) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            position: member.position,
            category: member.category,
            bio: member.bio,
            image: member.image,
            whatsapp: member.whatsapp || "",
            website: member.website || "",
            facebook: member.facebook || "",
            instagram: member.instagram || "",
            twitter: member.twitter || "",
        });
        setPhotoPreview(member.image);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingMember(null);
        setFormData({
            name: "",
            position: "",
            category: "ASOCIADOS",
            bio: "",
            image: PLACEHOLDER_IMAGE,
            whatsapp: "",
            website: "",
            facebook: "",
            instagram: "",
            twitter: "",
        });
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Filter by category and search query
    const filteredMembers = members.filter(m => {
        const matchesCategory = filterCategory === "ALL" || m.category === filterCategory;
        const matchesSearch = searchQuery === "" ||
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.bio.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    const handleFilterChange = (category: MemberCategory | "ALL") => {
        setFilterCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const getCategoryBadge = (category: MemberCategory) => {
        const cat = CATEGORIES.find(c => c.value === category);
        const colors = {
            FUNDADORES: "bg-pink-500/20 text-pink-400 border-pink-500/30",
            TITULARES: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            ASOCIADOS: "bg-violet-500/20 text-violet-400 border-violet-500/30",
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${colors[category]}`}>
                {cat?.icon}
                {cat?.label}
            </span>
        );
    };

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Miembros</h1>
                        <p className="text-muted-foreground">Gestiona los miembros de REVEPSIC</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Nuevo Miembro
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search input */}
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, cargo o biografía..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Category filters */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => handleFilterChange("ALL")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filterCategory === "ALL" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Todos ({members.length})
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => handleFilterChange(cat.value)}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filterCategory === cat.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {cat.icon}
                                {cat.label} ({members.filter(m => m.category === cat.value).length})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results count */}
                <div className="text-sm text-muted-foreground">
                    Mostrando {paginatedMembers.length} de {filteredMembers.length} miembros
                    {searchQuery && ` (búsqueda: "${searchQuery}")`}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 bg-card rounded-2xl border border-border animate-pulse">
                                <div className="h-16 w-16 mx-auto rounded-full bg-muted mb-4" />
                                <div className="h-5 w-32 mx-auto bg-muted rounded" />
                            </div>
                        ))}
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No hay miembros en esta categoría</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedMembers.map((member) => (
                            <div
                                key={member.id}
                                className={`p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all group ${!member.isActive ? "opacity-60" : ""
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                        {member.image ? (
                                            <Image src={member.image} alt={member.name} fill sizes="64px" className="rounded-full object-cover" unoptimized />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                                                <UserCircle className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                                        <p className="text-sm text-muted-foreground truncate">{member.position}</p>
                                        <div className="mt-2">{getCategoryBadge(member.category)}</div>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4 line-clamp-2">{member.bio}</p>
                                <p className="text-xs text-primary mt-2">/m/{member.slug}</p>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                                    <button
                                        onClick={() => handleToggle(member.id)}
                                        className={`inline-flex items-center gap-1 text-xs font-medium ${member.isActive ? "text-green-500" : "text-muted-foreground"}`}
                                    >
                                        {member.isActive ? <><ToggleRight className="h-5 w-5" /> Activo</> : <><ToggleLeft className="h-5 w-5" /> Inactivo</>}
                                    </button>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(member)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                                            <Edit className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                        <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground font-medium rounded-xl hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Anterior
                        </button>

                        <span className="text-sm text-muted-foreground">
                            Página {currentPage} de {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground font-medium rounded-xl hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold text-foreground mb-6">
                                {editingMember ? "Editar Miembro" : "Nuevo Miembro"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Foto</label>
                                    <div className="flex justify-center">
                                        {photoPreview ? (
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                                                    <Image src={photoPreview} alt="Preview" width={96} height={96} className="object-cover w-full h-full" unoptimized={photoPreview.startsWith("data:")} />
                                                </div>
                                                <div className="absolute -top-1 -right-1 flex gap-1">
                                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 bg-muted hover:bg-accent rounded-full transition-colors">
                                                        <Upload className="h-3 w-3" />
                                                    </button>
                                                    <button type="button" onClick={removePhoto} className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-muted/50 transition-colors">
                                                <UserCircle className="h-8 w-8 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">Subir</span>
                                            </button>
                                        )}
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileSelect} className="hidden" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Nombre *</label>
                                        <input type="text" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} required minLength={2} className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Cargo *</label>
                                        <input type="text" value={formData.position} onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))} required minLength={2} className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Categoría *</label>
                                    <select value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as MemberCategory }))} className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                                        {CATEGORIES.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Biografía * (mín. 10 caracteres)</label>
                                    <textarea value={formData.bio} onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))} required minLength={10} rows={3} className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                                    <p className="text-xs text-muted-foreground">{formData.bio.length}/10 caracteres mínimo</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">WhatsApp</label>
                                        <input type="text" value={formData.whatsapp} onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))} placeholder="+584121234567" className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Sitio Web</label>
                                        <input type="url" value={formData.website} onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))} placeholder="https://..." className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Redes Sociales</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input type="url" value={formData.facebook} onChange={(e) => setFormData((prev) => ({ ...prev, facebook: e.target.value }))} placeholder="Facebook" className="px-3 py-2 bg-muted border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                                        <input type="url" value={formData.instagram} onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))} placeholder="Instagram" className="px-3 py-2 bg-muted border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                                        <input type="url" value={formData.twitter} onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))} placeholder="Twitter" className="px-3 py-2 bg-muted border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-muted text-foreground font-medium rounded-xl hover:bg-accent transition-colors">Cancelar</button>
                                    <button type="submit" disabled={isSaving || isUploading} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                                        {(isSaving || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isSaving ? "Guardando..." : isUploading ? "Subiendo..." : editingMember ? "Actualizar" : "Crear"}
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
