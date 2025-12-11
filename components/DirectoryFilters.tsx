"use client";
import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    MapPin,
    Building2,
    Laptop,
    Home,
    Shield,
    ChevronDown,
    Stethoscope
} from "lucide-react";
import type { ConsultationType } from "@/lib/api";

interface DirectoryFiltersProps {
    cities?: string[];
    specialties?: string[];
    therapies?: string[];
}

const CONSULTATION_OPTIONS: { value: ConsultationType | ""; label: string; icon: React.ReactNode }[] = [
    { value: "", label: "Modalidad", icon: <Laptop className="w-4 h-4" /> },
    { value: "PRESENCIAL", label: "Presencial", icon: <Building2 className="w-4 h-4" /> },
    { value: "ONLINE", label: "Online", icon: <Laptop className="w-4 h-4" /> },
    { value: "DOMICILIO", label: "A domicilio", icon: <Home className="w-4 h-4" /> },
];

export default function DirectoryFilters({ cities = [] }: DirectoryFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("specialty") || "");
    const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
    const [selectedConsultationType, setSelectedConsultationType] = useState<ConsultationType | "">(
        (searchParams.get("consultationType") as ConsultationType) || ""
    );
    const [acceptsInsurance, setAcceptsInsurance] = useState(searchParams.get("acceptsInsurance") === "true");

    const applyFilters = useCallback(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set("specialty", searchTerm);
        if (selectedCity) params.set("city", selectedCity);
        if (selectedConsultationType) params.set("consultationType", selectedConsultationType);
        if (acceptsInsurance) params.set("acceptsInsurance", "true");

        const queryString = params.toString();
        router.push(`/directorio${queryString ? `?${queryString}` : ""}`);
    }, [router, searchTerm, selectedCity, selectedConsultationType, acceptsInsurance]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") applyFilters();
    };

    return (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-xl">
            {/* Search input */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar por especialidad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>

            {/* City select */}
            <div className="relative min-w-[140px]">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                    value={selectedCity}
                    onChange={(e) => { setSelectedCity(e.target.value); }}
                    className="w-full pl-10 pr-8 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">Ciudad</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Consultation type */}
            <div className="relative min-w-[140px]">
                <Laptop className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                    value={selectedConsultationType}
                    onChange={(e) => { setSelectedConsultationType(e.target.value as ConsultationType | ""); }}
                    className="w-full pl-10 pr-8 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {CONSULTATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Therapy type placeholder */}
            <div className="relative min-w-[150px]">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                    className="w-full pl-10 pr-8 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">Tipo de terapia</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Insurance toggle */}
            <button
                onClick={() => { setAcceptsInsurance(!acceptsInsurance); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${acceptsInsurance
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground"
                    }`}
            >
                <Shield className="w-4 h-4" />
                Seguros
            </button>

            {/* Search button */}
            <button
                onClick={applyFilters}
                className="px-6 py-2.5 gradient-bg text-slate-950 text-sm font-semibold rounded-lg hover:opacity-90 transition-all"
            >
                Buscar
            </button>
        </div>
    );
}
