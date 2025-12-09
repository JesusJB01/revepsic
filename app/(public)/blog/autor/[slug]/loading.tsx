export default function Loading() {
    return (
        <section className="py-16">
            <div className="container max-w-4xl animate-pulse">
                {/* Breadcrumbs */}
                <div className="h-4 w-24 bg-muted rounded mb-8" />

                {/* Author Card */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 p-8 bg-card rounded-2xl border border-border">
                    <div className="h-24 w-24 rounded-full bg-muted" />
                    <div className="flex-1">
                        <div className="h-8 w-48 bg-muted rounded mb-2" />
                        <div className="h-4 w-64 bg-muted rounded" />
                    </div>
                </div>

                {/* Title */}
                <div className="h-6 w-48 bg-muted rounded mb-6" />

                {/* Posts list skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                            <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0" />
                            <div className="flex-1">
                                <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                                <div className="h-4 w-full bg-muted rounded mb-2" />
                                <div className="h-3 w-20 bg-muted rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
