'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

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

    return (
        <div className={`flex items-center justify-center gap-2 mt-12 transition-opacity ${isPending ? 'opacity-60' : ''}`}>
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || isPending}
                className="px-4 py-2 bg-card border border-border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
                Anterior
            </button>

            <span className="text-muted-foreground px-4">
                Página {currentPage} de {totalPages}
            </span>

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || isPending}
                className="px-4 py-2 bg-card border border-border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
                Siguiente
            </button>
        </div>
    );
}
