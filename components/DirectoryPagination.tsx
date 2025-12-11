"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DirectoryPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export default function DirectoryPagination({ currentPage, totalPages, totalItems }: DirectoryPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page === 1) {
            params.delete("page");
        } else {
            params.set("page", String(page));
        }
        router.push(`/directorio?${params.toString()}`);
    };

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showAround = 2; // Pages to show around current

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - showAround && i <= currentPage + showAround)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {/* Previous */}
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-muted text-foreground rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, i) =>
                    page === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => goToPage(page as number)}
                            className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${currentPage === page
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground hover:bg-accent"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Next */}
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-muted text-foreground rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
