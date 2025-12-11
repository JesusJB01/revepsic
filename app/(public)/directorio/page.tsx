import React, { Suspense } from "react";
import { Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DirectoryCard from "@/components/DirectoryCard";
import DirectoryFilters from "@/components/DirectoryFilters";
import DirectoryPagination from "@/components/DirectoryPagination";
import { FadeIn } from "@/components/animations";
import { getDirectoryMembers, type DirectoryFilters as DirectoryFiltersType } from "@/lib/data/team";

// Dynamic page for directory with search functionality
export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 10;

interface DirectoryPageProps {
    searchParams: Promise<{
        city?: string;
        specialty?: string;
        therapy?: string;
        category?: string;
        consultationType?: string;
        acceptsInsurance?: string;
        page?: string;
    }>;
}

export default async function DirectorioPage({ searchParams }: DirectoryPageProps) {
    const params = await searchParams;
    const currentPage = parseInt(params.page || "1", 10);

    // Build filters from search params
    const filters: DirectoryFiltersType = {};
    if (params.city) filters.city = params.city;
    if (params.specialty) filters.specialty = params.specialty;
    if (params.therapy) filters.therapy = params.therapy;
    if (params.category) filters.category = params.category as DirectoryFiltersType["category"];
    if (params.consultationType) filters.consultationType = params.consultationType as DirectoryFiltersType["consultationType"];
    if (params.acceptsInsurance === "true") filters.acceptsInsurance = true;

    // Fetch members from directory API
    const allMembers = await getDirectoryMembers(Object.keys(filters).length > 0 ? filters : undefined);

    // Pagination
    const totalMembers = allMembers.length;
    const totalPages = Math.ceil(totalMembers / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const members = allMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Extract unique cities for filter dropdown
    const cities = Array.from(new Set(allMembers.filter(m => m.city).map(m => m.city!))).sort();

    return (
        <>
            <PageHeader
                title="Directorio de Psicólogos"
                subtitle="Encuentra al profesional ideal para ti"
                imageSrc="/team2.svg"
                imageAlt="Directorio REVEPSIC"
            />

            <section className="py-12 md:py-16 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
                </div>

                <div className="container relative z-10">
                    {/* Filters */}
                    <FadeIn className="mb-8">
                        <Suspense fallback={<div className="h-14 bg-muted/50 rounded-xl animate-pulse" />}>
                            <DirectoryFilters cities={cities} />
                        </Suspense>
                    </FadeIn>

                    {/* Results count */}
                    <FadeIn className="mb-6">
                        <p className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{totalMembers}</span> psicólogos encontrados
                        </p>
                    </FadeIn>

                    {/* Results list */}
                    {members.length > 0 ? (
                        <div className="space-y-4">
                            {members.map((member, index) => (
                                <DirectoryCard
                                    key={member.id}
                                    member={member}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <FadeIn>
                            <div className="text-center py-16 bg-card rounded-xl border border-border">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    No se encontraron resultados
                                </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Intenta ajustar tus filtros de búsqueda o explora todo el directorio.
                                </p>
                            </div>
                        </FadeIn>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <FadeIn className="mt-8">
                            <DirectoryPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalMembers}
                            />
                        </FadeIn>
                    )}
                </div>
            </section>
        </>
    );
}
