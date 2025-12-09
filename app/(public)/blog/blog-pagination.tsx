'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    currentPage: number;
    totalPages: number;
    currentTag?: string;
}

export default function BlogPagination({ currentPage, totalPages, currentTag }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (page > 1) {
            params.set('page', String(page));
        } else {
            params.delete('page');
        }

        startTransition(() => {
            router.push(`/blog?${params.toString()}`);
        });
    };

    // Generar array de páginas a mostrar
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisible = 5; // Máximo de páginas visibles

        if (totalPages <= maxVisible) {
            // Si hay pocas páginas, mostrar todas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Siempre mostrar primera página
            pages.push(1);

            // Calcular rango alrededor de la página actual
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Ajustar si estamos cerca del inicio
            if (currentPage <= 3) {
                end = 4;
            }

            // Ajustar si estamos cerca del final
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }

            // Agregar ellipsis si hay gap al inicio
            if (start > 2) {
                pages.push('ellipsis');
            }

            // Agregar páginas del rango
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Agregar ellipsis si hay gap al final
            if (end < totalPages - 1) {
                pages.push('ellipsis');
            }

            // Siempre mostrar última página
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={`flex items-center justify-center gap-2 mt-12 transition-opacity ${isPending ? 'opacity-60' : ''}`}>
            {/* Botón Anterior */}
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || isPending}
                className="p-2 bg-card border border-border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                aria-label="Página anterior"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Números de página */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => (
                    page === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            disabled={isPending}
                            className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl font-medium transition-colors
                                ${currentPage === page
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card border border-border hover:bg-muted text-foreground'
                                }
                                disabled:cursor-not-allowed
                            `}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            {/* Botón Siguiente */}
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || isPending}
                className="p-2 bg-card border border-border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                aria-label="Página siguiente"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}
