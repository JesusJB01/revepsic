export default function Loading() {
    return (
        <div className="py-12">
            <div className="container">
                {/* Skeleton del header */}
                <div className="relative h-48 md:h-64 bg-muted rounded-2xl animate-pulse mb-8 overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="h-8 w-32 bg-muted-foreground/20 rounded mb-2" />
                        <div className="h-4 w-64 bg-muted-foreground/20 rounded" />
                    </div>
                </div>

                {/* Skeleton de filtros */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="h-10 w-full max-w-md bg-muted rounded-xl animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-10 w-20 bg-muted rounded-xl animate-pulse" />
                        <div className="h-10 w-24 bg-muted rounded-xl animate-pulse" />
                        <div className="h-10 w-28 bg-muted rounded-xl animate-pulse" />
                    </div>
                </div>

                {/* Skeleton de posts */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse"
                        >
                            <div className="h-48 bg-muted" />
                            <div className="p-6">
                                <div className="h-4 w-20 bg-muted rounded mb-3" />
                                <div className="h-6 w-full bg-muted rounded mb-2" />
                                <div className="h-4 w-2/3 bg-muted rounded mb-4" />
                                <div className="flex justify-between">
                                    <div className="h-3 w-20 bg-muted rounded" />
                                    <div className="h-3 w-16 bg-muted rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
