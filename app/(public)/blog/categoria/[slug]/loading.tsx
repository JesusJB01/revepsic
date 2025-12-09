export default function Loading() {
    return (
        <>
            {/* Page Header skeleton */}
            <div className="relative h-48 md:h-64 bg-muted animate-pulse">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="h-8 w-32 bg-muted-foreground/20 rounded mb-2" />
                    <div className="h-4 w-64 bg-muted-foreground/20 rounded" />
                </div>
            </div>

            <section className="py-12 md:py-16">
                <div className="container animate-pulse">
                    {/* Breadcrumbs */}
                    <div className="h-4 w-32 bg-muted rounded mb-8" />

                    {/* Posts grid skeleton */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
                                <div className="h-48 bg-muted" />
                                <div className="p-6">
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
            </section>
        </>
    );
}
