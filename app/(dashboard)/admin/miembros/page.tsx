"use client";
import React, { useEffect, useState, useRef } from "react";
import { membersApi, uploadApi, DirectoryMember, MemberCategory, CreateMemberDto, SubscriptionPlan, SubscriptionType, ConsultationType, Education, MemberLocation, PriceRange } from "@/lib/api";
import Image from "next/image";
import { Plus, Edit, Trash2, UserCircle, Upload, X, Loader2, ToggleLeft, ToggleRight, Users, Award, Star, ChevronDown, ChevronUp, MapPin, BadgeCheck, Calendar } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";

const CATEGORIES: { value: MemberCategory; label: string; icon: React.ReactNode }[] = [
    { value: "FUNDADORES", label: "Fundador", icon: <Award className="h-4 w-4" /> },
    { value: "TITULARES", label: "Titular", icon: <Star className="h-4 w-4" /> },
    { value: "ASOCIADOS", label: "Asociado", icon: <Users className="h-4 w-4" /> },
];

const SUBSCRIPTION_PLANS: { value: SubscriptionPlan; label: string }[] = [
    { value: "DIRECTORY_ONLY", label: "Solo Directorio" },
    { value: "ASOCIADO_PLUS", label: "Asociado Plus" },
    { value: "ASOCIADO_PRO", label: "Asociado Pro" },
];

const SUBSCRIPTION_TYPES: { value: SubscriptionType; label: string }[] = [
    { value: "MONTHLY", label: "Mensual" },
    { value: "ANNUAL", label: "Anual" },
];

const CONSULTATION_TYPES: { value: ConsultationType; label: string }[] = [
    { value: "PRESENCIAL", label: "Presencial" },
    { value: "ONLINE", label: "Online" },
    { value: "DOMICILIO", label: "A domicilio" },
];

const PLACEHOLDER_IMAGE = "https://picsum.photos/200";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const getInitialFormData = (): CreateMemberDto => ({
    name: "", position: "", category: "ASOCIADOS", bio: "", image: PLACEHOLDER_IMAGE,
    whatsapp: "", phone: "", email: "", website: "", facebook: "", instagram: "", twitter: "", linkedin: "",
    city: "", state: "", country: "Venezuela",
    subscriptionPlan: "DIRECTORY_ONLY", subscriptionType: undefined,
    gender: "", birthDate: "",
    licenseNumber: "", experienceYears: undefined, profileDescription: "",
    specialties: [], therapies: [], disorders: [], languages: ["Español"], targetAges: [], certifications: [],
    education: [], consultationTypes: [],
    acceptsInsurance: false, insuranceProviders: [],
    priceRange: undefined, firstSessionFree: false,
    locations: [], videoUrl: "",
    schedule: { slots: {}, notes: "", timezone: "America/Caracas" },
});

// Clean form data before sending to API
// Clean form data before sending to API
const cleanFormData = (data: CreateMemberDto): Partial<CreateMemberDto> => {
    const cleaned: Partial<CreateMemberDto> = {
        name: data.name.trim(),
        position: data.position.trim(),
        category: data.category,
        bio: data.bio.trim(),
        image: data.image || PLACEHOLDER_IMAGE,
    };

    // Helper to add only if descriptive
    const addIfVal = (key: keyof CreateMemberDto, val: any) => {
        if (typeof val === 'string' && val.trim()) cleaned[key] = val.trim() as any;
        else if (typeof val === 'number') cleaned[key] = val as any;
        else if (Array.isArray(val) && val.length > 0) cleaned[key] = val as any;
        else if (typeof val === 'boolean') cleaned[key] = val as any;
    };

    addIfVal('whatsapp', data.whatsapp);
    addIfVal('phone', data.phone);
    addIfVal('email', data.email);
    addIfVal('website', data.website);
    addIfVal('facebook', data.facebook);
    addIfVal('instagram', data.instagram);
    addIfVal('twitter', data.twitter);
    addIfVal('linkedin', data.linkedin);

    addIfVal('city', data.city);
    addIfVal('state', data.state);
    addIfVal('country', data.country);

    if (data.subscriptionPlan) cleaned.subscriptionPlan = data.subscriptionPlan;
    if (data.subscriptionType) cleaned.subscriptionType = data.subscriptionType;

    // Date fields handling - Convert to ISO string for backend
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return undefined;
        try {
            return new Date(dateStr).toISOString();
        } catch (e) {
            return dateStr;
        }
    };

    if (data.subscriptionStart) cleaned.subscriptionStart = formatDate(data.subscriptionStart);
    if (data.subscriptionEnd) cleaned.subscriptionEnd = formatDate(data.subscriptionEnd);
    if (data.memberSince) cleaned.memberSince = formatDate(data.memberSince);

    addIfVal('gender', data.gender);
    if (data.birthDate) cleaned.birthDate = formatDate(data.birthDate);

    addIfVal('licenseNumber', data.licenseNumber);
    if (data.experienceYears !== undefined && data.experienceYears > 0) cleaned.experienceYears = data.experienceYears;
    addIfVal('profileDescription', data.profileDescription);
    addIfVal('videoUrl', data.videoUrl);

    addIfVal('specialties', data.specialties);
    addIfVal('therapies', data.therapies);
    addIfVal('disorders', data.disorders);
    addIfVal('languages', data.languages);
    addIfVal('targetAges', data.targetAges);
    addIfVal('certifications', data.certifications);
    addIfVal('consultationTypes', data.consultationTypes);

    if (data.acceptsInsurance) cleaned.acceptsInsurance = true;
    addIfVal('insuranceProviders', data.insuranceProviders);

    if (data.firstSessionFree) cleaned.firstSessionFree = true;

    // Price Range cleaning
    if (data.priceRange && (data.priceRange.min > 0 || data.priceRange.max > 0)) {
        cleaned.priceRange = {
            min: Number(data.priceRange.min),
            max: Number(data.priceRange.max),
            currency: data.priceRange.currency || "USD",
        };
        if (data.priceRange.notes?.trim()) {
            cleaned.priceRange.notes = data.priceRange.notes.trim();
        }
    }

    // Schedule cleaning
    if (data.schedule && data.schedule.slots && Object.keys(data.schedule.slots).length > 0) {
        // Clean empty slots arrays
        const cleanSlots: Record<string, any> = {};
        Object.entries(data.schedule.slots).forEach(([day, slots]) => {
            if (slots && slots.length > 0) {
                cleanSlots[day] = slots;
            }
        });

        if (Object.keys(cleanSlots).length > 0) {
            cleaned.schedule = {
                slots: cleanSlots,
                timezone: data.schedule.timezone || "America/Caracas"
            };
            // Only include notes if present and not empty
            if (data.schedule.notes?.trim()) {
                cleaned.schedule.notes = data.schedule.notes.trim();
            }
        }
    }

    return cleaned;
};


export default function MembersAdminPage() {
    const [members, setMembers] = useState<DirectoryMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<DirectoryMember | null>(null);
    const [formData, setFormData] = useState<CreateMemberDto>(getInitialFormData());
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [filterCategory, setFilterCategory] = useState<MemberCategory | "ALL">("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState(0);
    const ITEMS_PER_PAGE = 9;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Tag inputs state
    const [specialtyInput, setSpecialtyInput] = useState("");
    const [therapyInput, setTherapyInput] = useState("");
    const [languageInput, setLanguageInput] = useState("");
    const [targetAgeInput, setTargetAgeInput] = useState("");

    useEffect(() => { fetchMembers(); }, []);

    const fetchMembers = async () => {
        try {
            const response = await membersApi.getAllAdmin();
            if (response.success && response.data) {
                setMembers(Array.isArray(response.data) ? response.data : []);
            } else { setMembers([]); }
        } catch (error) { console.error("Error fetching members:", error); setMembers([]); }
        setIsLoading(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) { alert("Formato no válido. Usa JPG, PNG, GIF o WEBP."); return; }
        if (file.size > 5 * 1024 * 1024) { alert("La imagen es muy grande. Máximo 5MB."); return; }
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const removePhoto = () => { setPhotoFile(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

    const revalidateMembers = async (slug?: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            await fetch("/api/admin/revalidate", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
                body: JSON.stringify({ type: "member", slug }),
            });
        } catch (error) { console.error("Failed to revalidate:", error); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim().length < 2) { alert("El nombre debe tener al menos 2 caracteres"); return; }
        if (formData.position.trim().length < 2) { alert("El cargo debe tener al menos 2 caracteres"); return; }
        if (formData.bio.trim().length < 10) { alert("La biografía debe tener al menos 10 caracteres"); return; }

        setIsSaving(true);
        // Clean and prepare data
        const cleanedData = cleanFormData(formData);
        // Format whatsapp
        if (cleanedData.whatsapp) {
            let whatsapp = cleanedData.whatsapp.replace(/[\s-]/g, '');
            if (!whatsapp.startsWith('+')) whatsapp = '+' + whatsapp;
            cleanedData.whatsapp = whatsapp;
        }

        console.log("Sending data to API:", JSON.stringify(cleanedData, null, 2));

        try {
            if (editingMember) {
                const response = await membersApi.update(editingMember.id, cleanedData);
                if (response.success) {
                    if (photoFile) { setIsUploading(true); await uploadApi.uploadMemberPhoto(editingMember.id, photoFile); setIsUploading(false); }
                    await revalidateMembers(editingMember.slug);
                    fetchMembers(); closeModal();
                } else {
                    const msg = (response as any).message;
                    const errorMsg = typeof msg === 'string'
                        ? msg
                        : (Array.isArray(msg) ? msg.join(', ') : JSON.stringify(msg || response.error || response));
                    console.error("API Error FULL:", JSON.stringify(response, null, 2));
                    alert(`Error al actualizar miembro:\n${errorMsg}`);
                }
            } else {
                const response = await membersApi.create(cleanedData as CreateMemberDto);
                if (response.success && response.data) {
                    if (photoFile) { setIsUploading(true); await uploadApi.uploadMemberPhoto(response.data.id, photoFile); setIsUploading(false); }
                    await revalidateMembers();
                    fetchMembers(); closeModal();
                } else {
                    const msg = (response as any).message;
                    const errorMsg = typeof msg === 'string'
                        ? msg
                        : (Array.isArray(msg) ? msg.join(', ') : JSON.stringify(msg || response.error || response));
                    console.error("API Error FULL:", JSON.stringify(response, null, 2));
                    alert(`Error al crear miembro:\n${errorMsg}`);
                }
            }
        } catch (error: unknown) {
            console.error("Error saving member:", error);
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar";
            alert(`Error al guardar miembro:\n${errorMessage}`);
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este miembro?")) return;
        try {
            const response = await membersApi.delete(id);
            if (response.success) { await revalidateMembers(); fetchMembers(); }
            else { alert(response.message || "Error al eliminar miembro"); }
        } catch (error) { console.error("Error deleting member:", error); alert("Error al eliminar miembro"); }
    };

    const handleToggle = async (id: string) => {
        try {
            const response = await membersApi.toggle(id);
            if (response.success) { await revalidateMembers(); fetchMembers(); }
            else { alert(response.message || "Error al cambiar estado"); }
        } catch (error) { console.error("Error toggling member:", error); alert("Error al cambiar estado del miembro"); }
    };

    const openEditModal = (member: DirectoryMember) => {
        setEditingMember(member);
        setFormData({
            name: member.name, position: member.position, category: member.category, bio: member.bio, image: member.image,
            whatsapp: member.whatsapp || "", phone: member.phone || "", email: member.email || "",
            website: member.website || "", facebook: member.facebook || "", instagram: member.instagram || "",
            twitter: member.twitter || "", linkedin: member.linkedin || "",
            city: member.city || "", state: member.state || "", country: member.country || "Venezuela",
            subscriptionPlan: member.subscriptionPlan || "DIRECTORY_ONLY", subscriptionType: member.subscriptionType || undefined,
            gender: member.gender || "", birthDate: member.birthDate?.split('T')[0] || "",
            licenseNumber: member.licenseNumber || "", experienceYears: member.experienceYears || undefined,
            profileDescription: member.profileDescription || "",
            specialties: member.specialties || [], therapies: member.therapies || [], disorders: member.disorders || [],
            languages: member.languages || ["Español"], targetAges: member.targetAges || [], certifications: member.certifications || [],
            education: member.education || [], consultationTypes: member.consultationTypes || [],
            acceptsInsurance: member.acceptsInsurance || false, insuranceProviders: member.insuranceProviders || [],
            priceRange: member.priceRange || undefined, firstSessionFree: member.firstSessionFree || false,
            locations: member.locations || [], videoUrl: member.videoUrl || "",
        });
        setPhotoPreview(member.image);
        setShowModal(true);
        setActiveTab(0);
    };

    const closeModal = () => { setShowModal(false); setEditingMember(null); setFormData(getInitialFormData()); setPhotoFile(null); setPhotoPreview(null); setActiveTab(0); if (fileInputRef.current) fileInputRef.current.value = ""; };

    const addTag = (field: 'specialties' | 'therapies' | 'languages' | 'targetAges', value: string, setter: (v: string) => void) => {
        if (value.trim() && !(formData[field] || []).includes(value.trim())) {
            setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), value.trim()] }));
        }
        setter("");
    };

    const removeTag = (field: 'specialties' | 'therapies' | 'languages' | 'targetAges', index: number) => {
        setFormData(prev => ({ ...prev, [field]: (prev[field] || []).filter((_, i) => i !== index) }));
    };

    const filteredMembers = members.filter(m => {
        const matchesCategory = filterCategory === "ALL" || m.category === filterCategory;
        const matchesSearch = searchQuery === "" || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.position.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
    const paginatedMembers = filteredMembers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const getCategoryBadge = (category: MemberCategory) => {
        const cat = CATEGORIES.find(c => c.value === category);
        const colors = { FUNDADORES: "bg-pink-500/20 text-pink-400 border-pink-500/30", TITULARES: "bg-amber-500/20 text-amber-400 border-amber-500/30", ASOCIADOS: "bg-violet-500/20 text-violet-400 border-violet-500/30" };
        return <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${colors[category]}`}>{cat?.icon}{cat?.label}</span>;
    };

    const TABS = ["Básico", "Contacto", "Ubicación", "Suscripción", "Profesional", "Especialización", "Precios", "Horarios"];

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div><h1 className="text-3xl font-bold text-foreground">Miembros</h1><p className="text-muted-foreground">Gestiona los miembros de REVEPSIC</p></div>
                    <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all"><Plus className="h-5 w-5" />Nuevo Miembro</button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => { setFilterCategory("ALL"); setCurrentPage(1); }} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filterCategory === "ALL" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>Todos ({members.length})</button>
                        {CATEGORIES.map((cat) => (
                            <button key={cat.value} onClick={() => { setFilterCategory(cat.value); setCurrentPage(1); }} className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filterCategory === cat.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{cat.icon}{cat.label}</button>
                        ))}
                    </div>
                </div>

                <div className="text-sm text-muted-foreground">Mostrando {paginatedMembers.length} de {filteredMembers.length} miembros</div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3].map((i) => (<div key={i} className="p-6 bg-card rounded-2xl border border-border animate-pulse"><div className="h-16 w-16 mx-auto rounded-full bg-muted mb-4" /><div className="h-5 w-32 mx-auto bg-muted rounded" /></div>))}</div>
                ) : filteredMembers.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border"><Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No hay miembros</p></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedMembers.map((member) => (
                            <div key={member.id} className={`p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all group ${!member.isActive ? "opacity-60" : ""}`}>
                                <div className="flex items-start gap-4">
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                        {member.image ? <Image src={member.image} alt={member.name} fill sizes="64px" className="rounded-full object-cover" unoptimized /> : <div className="w-full h-full rounded-full bg-muted flex items-center justify-center"><UserCircle className="h-8 w-8 text-muted-foreground" /></div>}
                                        {member.isVerified && <BadgeCheck className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                                        <p className="text-sm text-muted-foreground truncate">{member.position}</p>
                                        {member.city && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{member.city}</p>}
                                        <div className="mt-2 flex gap-1">{getCategoryBadge(member.category)}{member.subscriptionPlan === "ASOCIADO_PRO" && <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-full">PRO</span>}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                                    <button onClick={() => handleToggle(member.id)} className={`inline-flex items-center gap-1 text-xs font-medium ${member.isActive ? "text-green-500" : "text-muted-foreground"}`}>{member.isActive ? <><ToggleRight className="h-5 w-5" />Activo</> : <><ToggleLeft className="h-5 w-5" />Inactivo</>}</button>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(member)} className="p-2 hover:bg-muted rounded-lg transition-colors"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                                        <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-muted text-foreground font-medium rounded-xl disabled:opacity-50">Anterior</button>
                        <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-muted text-foreground font-medium rounded-xl disabled:opacity-50">Siguiente</button>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h2 className="text-xl font-bold text-foreground">{editingMember ? "Editar Miembro" : "Nuevo Miembro"}</h2>
                                <button onClick={closeModal} className="p-2 hover:bg-muted rounded-lg"><X className="h-5 w-5" /></button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-border overflow-x-auto">
                                {TABS.map((tab, i) => (
                                    <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === i ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                                {/* Tab 0: Básico */}
                                {activeTab === 0 && (
                                    <div className="space-y-4">
                                        <div className="flex justify-center">
                                            {photoPreview ? (
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border"><Image src={photoPreview} alt="Preview" width={96} height={96} className="object-cover w-full h-full" unoptimized={photoPreview.startsWith("data:")} /></div>
                                                    <div className="absolute -top-1 -right-1 flex gap-1">
                                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 bg-muted hover:bg-accent rounded-full"><Upload className="h-3 w-3" /></button>
                                                        <button type="button" onClick={removePhoto} className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full"><X className="h-3 w-3" /></button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50"><UserCircle className="h-8 w-8 text-muted-foreground" /><span className="text-xs text-muted-foreground">Subir</span></button>
                                            )}
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-medium text-foreground">Nombre *</label><input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                                            <div><label className="text-sm font-medium text-foreground">Cargo *</label><input type="text" value={formData.position} onChange={e => setFormData(p => ({ ...p, position: e.target.value }))} required className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                                        </div>
                                        <div><label className="text-sm font-medium text-foreground">Categoría *</label><select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value as MemberCategory }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary">{CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                                        <div><label className="text-sm font-medium text-foreground">Biografía * (mín. 10 caracteres)</label><textarea value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} required rows={3} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" /></div>
                                    </div>
                                )}

                                {/* Tab 1: Contacto */}
                                {activeTab === 1 && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-medium">WhatsApp</label><input type="text" value={formData.whatsapp} onChange={e => setFormData(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+584121234567" className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                            <div><label className="text-sm font-medium">Teléfono</label><input type="text" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                        </div>
                                        <div><label className="text-sm font-medium">Email</label><input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                        <div><label className="text-sm font-medium">Sitio Web</label><input type="url" value={formData.website} onChange={e => setFormData(p => ({ ...p, website: e.target.value }))} placeholder="https://..." className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-medium">Facebook</label><input type="url" value={formData.facebook} onChange={e => setFormData(p => ({ ...p, facebook: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                            <div><label className="text-sm font-medium">Instagram</label><input type="url" value={formData.instagram} onChange={e => setFormData(p => ({ ...p, instagram: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-medium">Twitter</label><input type="url" value={formData.twitter} onChange={e => setFormData(p => ({ ...p, twitter: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                            <div><label className="text-sm font-medium">LinkedIn</label><input type="url" value={formData.linkedin} onChange={e => setFormData(p => ({ ...p, linkedin: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                        </div>
                                    </div>
                                )}

                                {/* Tab 2: Ubicación */}
                                {activeTab === 2 && (
                                    <div className="space-y-4">
                                        <div><label className="text-sm font-medium">Ciudad</label><input type="text" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                        <div><label className="text-sm font-medium">Estado</label><input type="text" value={formData.state} onChange={e => setFormData(p => ({ ...p, state: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                        <div><label className="text-sm font-medium">País</label><input type="text" value={formData.country} onChange={e => setFormData(p => ({ ...p, country: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                    </div>
                                )}

                                {/* Tab 3: Suscripción */}
                                {activeTab === 3 && (
                                    <div className="space-y-4">
                                        <div><label className="text-sm font-medium">Plan de Suscripción</label><select value={formData.subscriptionPlan} onChange={e => setFormData(p => ({ ...p, subscriptionPlan: e.target.value as SubscriptionPlan }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl">{SUBSCRIPTION_PLANS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
                                        {formData.subscriptionPlan !== "DIRECTORY_ONLY" && (
                                            <div><label className="text-sm font-medium">Tipo de Suscripción</label><select value={formData.subscriptionType || ""} onChange={e => setFormData(p => ({ ...p, subscriptionType: e.target.value as SubscriptionType || undefined }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl"><option value="">Seleccionar...</option>{SUBSCRIPTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select><p className="text-xs text-muted-foreground mt-1">Las fechas se calculan automáticamente al crear</p></div>
                                        )}
                                        <div><label className="text-sm font-medium">Fecha desde</label><input type="date" value={formData.memberSince?.split('T')[0] || ""} onChange={e => setFormData(p => ({ ...p, memberSince: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                    </div>
                                )}

                                {/* Tab 4: Profesional */}
                                {activeTab === 4 && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-medium">Género</label><select value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl"><option value="">Seleccionar...</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option><option value="Otro">Otro</option></select></div>
                                            <div><label className="text-sm font-medium">Fecha de Nacimiento</label><input type="date" value={formData.birthDate || ""} onChange={e => setFormData(p => ({ ...p, birthDate: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-medium">Nº de Licencia</label><input type="text" value={formData.licenseNumber} onChange={e => setFormData(p => ({ ...p, licenseNumber: e.target.value }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                            <div><label className="text-sm font-medium">Años de Experiencia</label><input type="number" min="0" value={formData.experienceYears || ""} onChange={e => setFormData(p => ({ ...p, experienceYears: e.target.value ? parseInt(e.target.value) : undefined }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                        </div>
                                        <div><label className="text-sm font-medium">Descripción del Perfil</label><textarea value={formData.profileDescription} onChange={e => setFormData(p => ({ ...p, profileDescription: e.target.value }))} rows={4} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl resize-none" placeholder="Mi enfoque terapéutico..." /></div>
                                        <div><label className="text-sm font-medium">Video de Presentación (URL)</label><input type="url" value={formData.videoUrl} onChange={e => setFormData(p => ({ ...p, videoUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=..." className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                    </div>
                                )}

                                {/* Tab 5: Especialización */}
                                {activeTab === 5 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">Especialidades</label>
                                            <div className="flex gap-2 mt-1"><input type="text" value={specialtyInput} onChange={e => setSpecialtyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('specialties', specialtyInput, setSpecialtyInput))} placeholder="Ansiedad, Depresión..." className="flex-1 px-4 py-2 bg-muted border border-border rounded-xl" /><button type="button" onClick={() => addTag('specialties', specialtyInput, setSpecialtyInput)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl">+</button></div>
                                            <div className="flex flex-wrap gap-2 mt-2">{formData.specialties?.map((s, i) => <span key={i} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-pink-500/10 text-pink-500 rounded-full">{s}<button type="button" onClick={() => removeTag('specialties', i)} className="hover:text-pink-300"><X className="w-3 h-3" /></button></span>)}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Tipos de Terapia</label>
                                            <div className="flex gap-2 mt-1"><input type="text" value={therapyInput} onChange={e => setTherapyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('therapies', therapyInput, setTherapyInput))} placeholder="TCC, EMDR..." className="flex-1 px-4 py-2 bg-muted border border-border rounded-xl" /><button type="button" onClick={() => addTag('therapies', therapyInput, setTherapyInput)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl">+</button></div>
                                            <div className="flex flex-wrap gap-2 mt-2">{formData.therapies?.map((t, i) => <span key={i} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-amber-500/10 text-amber-500 rounded-full">{t}<button type="button" onClick={() => removeTag('therapies', i)} className="hover:text-amber-300"><X className="w-3 h-3" /></button></span>)}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Idiomas</label>
                                            <div className="flex gap-2 mt-1"><input type="text" value={languageInput} onChange={e => setLanguageInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('languages', languageInput, setLanguageInput))} placeholder="Español, Inglés..." className="flex-1 px-4 py-2 bg-muted border border-border rounded-xl" /><button type="button" onClick={() => addTag('languages', languageInput, setLanguageInput)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl">+</button></div>
                                            <div className="flex flex-wrap gap-2 mt-2">{formData.languages?.map((l, i) => <span key={i} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-violet-500/10 text-violet-500 rounded-full">{l}<button type="button" onClick={() => removeTag('languages', i)} className="hover:text-violet-300"><X className="w-3 h-3" /></button></span>)}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Poblaciones</label>
                                            <div className="flex gap-2 mt-1"><input type="text" value={targetAgeInput} onChange={e => setTargetAgeInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('targetAges', targetAgeInput, setTargetAgeInput))} placeholder="Adultos, Parejas..." className="flex-1 px-4 py-2 bg-muted border border-border rounded-xl" /><button type="button" onClick={() => addTag('targetAges', targetAgeInput, setTargetAgeInput)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl">+</button></div>
                                            <div className="flex flex-wrap gap-2 mt-2">{formData.targetAges?.map((a, i) => <span key={i} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-500/10 text-green-500 rounded-full">{a}<button type="button" onClick={() => removeTag('targetAges', i)} className="hover:text-green-300"><X className="w-3 h-3" /></button></span>)}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Tipos de Consulta</label>
                                            <div className="flex flex-wrap gap-2 mt-2">{CONSULTATION_TYPES.map(ct => <button type="button" key={ct.value} onClick={() => setFormData(p => ({ ...p, consultationTypes: p.consultationTypes?.includes(ct.value) ? p.consultationTypes.filter(c => c !== ct.value) : [...(p.consultationTypes || []), ct.value] }))} className={`px-4 py-2 rounded-xl transition-colors ${formData.consultationTypes?.includes(ct.value) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{ct.label}</button>)}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Tab 6: Precios */}
                                {activeTab === 6 && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><label className="text-sm font-medium">Precio Mínimo</label><input type="number" min="0" value={formData.priceRange?.min || ""} onChange={e => setFormData(p => ({ ...p, priceRange: { ...(p.priceRange || { min: 0, max: 0 }), min: parseInt(e.target.value) || 0 } }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                            <div><label className="text-sm font-medium">Precio Máximo</label><input type="number" min="0" value={formData.priceRange?.max || ""} onChange={e => setFormData(p => ({ ...p, priceRange: { ...(p.priceRange || { min: 0, max: 0 }), max: parseInt(e.target.value) || 0 } }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                            <div><label className="text-sm font-medium">Moneda</label><select value={formData.priceRange?.currency || "USD"} onChange={e => setFormData(p => ({ ...p, priceRange: { ...(p.priceRange || { min: 0, max: 0 }), currency: e.target.value } }))} className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl"><option value="USD">USD</option><option value="EUR">EUR</option><option value="VES">VES</option></select></div>
                                        </div>
                                        <div><label className="text-sm font-medium">Notas de Precio</label><input type="text" value={formData.priceRange?.notes || ""} onChange={e => setFormData(p => ({ ...p, priceRange: { ...(p.priceRange || { min: 0, max: 0 }), notes: e.target.value } }))} placeholder="Consulta inicial gratuita..." className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" /></div>
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="firstSessionFree" checked={formData.firstSessionFree} onChange={e => setFormData(p => ({ ...p, firstSessionFree: e.target.checked }))} className="w-4 h-4" />
                                            <label htmlFor="firstSessionFree" className="text-sm font-medium">Primera sesión gratis</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="acceptsInsurance" checked={formData.acceptsInsurance} onChange={e => setFormData(p => ({ ...p, acceptsInsurance: e.target.checked }))} className="w-4 h-4" />
                                            <label htmlFor="acceptsInsurance" className="text-sm font-medium">Acepta seguros médicos</label>
                                        </div>
                                    </div>
                                )}

                                {/* Tab 7: Horarios */}
                                {activeTab === 7 && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">Agrega los horarios de atención del profesional</p>

                                        {/* Schedule by day */}
                                        <div className="space-y-3">
                                            {DAYS.map(day => {
                                                const dayKey = day.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // lunes, martes, miercoles, etc.
                                                const daySlots = formData.schedule?.slots?.[dayKey] || [];
                                                return (
                                                    <div key={day} className="p-3 bg-muted/50 rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium text-foreground">{day}</span>
                                                            <button type="button" onClick={() => {
                                                                const newSlot = { start: "09:00", end: "17:00" };
                                                                setFormData(p => ({
                                                                    ...p,
                                                                    schedule: {
                                                                        ...p.schedule,
                                                                        timezone: p.schedule?.timezone || "America/Caracas",
                                                                        slots: {
                                                                            ...(p.schedule?.slots || {}),
                                                                            [dayKey]: [...daySlots, newSlot]
                                                                        }
                                                                    }
                                                                }));
                                                            }} className="text-xs text-primary hover:underline">+ Agregar horario</button>
                                                        </div>
                                                        {daySlots.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {daySlots.map((slot, i) => (
                                                                    <div key={i} className="flex items-center gap-2 text-sm">
                                                                        <input type="time" value={slot.start} onChange={e => {
                                                                            const updated = [...daySlots];
                                                                            updated[i] = { ...slot, start: e.target.value };
                                                                            setFormData(p => ({
                                                                                ...p,
                                                                                schedule: { ...p.schedule, slots: { ...(p.schedule?.slots || {}), [dayKey]: updated } }
                                                                            }));
                                                                        }} className="px-2 py-1 bg-background border border-border rounded text-sm" />
                                                                        <span>-</span>
                                                                        <input type="time" value={slot.end} onChange={e => {
                                                                            const updated = [...daySlots];
                                                                            updated[i] = { ...slot, end: e.target.value };
                                                                            setFormData(p => ({
                                                                                ...p,
                                                                                schedule: { ...p.schedule, slots: { ...(p.schedule?.slots || {}), [dayKey]: updated } }
                                                                            }));
                                                                        }} className="px-2 py-1 bg-background border border-border rounded text-sm" />
                                                                        <button type="button" onClick={() => {
                                                                            const updated = daySlots.filter((_, idx) => idx !== i);
                                                                            setFormData(p => ({
                                                                                ...p,
                                                                                schedule: { ...p.schedule, slots: { ...(p.schedule?.slots || {}), [dayKey]: updated } }
                                                                            }));
                                                                        }} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><X className="w-3 h-3" /></button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-muted-foreground">Sin horario</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <label className="text-sm font-medium">Notas de horario</label>
                                            <input type="text" value={formData.schedule?.notes || ""} onChange={e => setFormData(p => ({ ...p, schedule: { ...(p.schedule || { slots: {} }), notes: e.target.value } }))} placeholder="Ej: Consultas con cita previa" className="w-full mt-1 px-4 py-2 bg-muted border border-border rounded-xl" />
                                        </div>
                                    </div>
                                )}
                            </form>

                            <div className="p-6 border-t border-border flex gap-2">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-muted text-foreground font-medium rounded-xl hover:bg-accent">Cancelar</button>
                                <button type="submit" onClick={handleSubmit} disabled={isSaving || isUploading} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">{(isSaving || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}{isSaving ? "Guardando..." : isUploading ? "Subiendo..." : editingMember ? "Actualizar" : "Crear"}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}
