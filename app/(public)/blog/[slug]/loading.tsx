export default function Loading() {
    return (
        <article className="py-16">
            <div className="container max-w-3xl animate-pulse">
                {/* Breadcrumbs */}
                <div className="h-4 w-32 bg-muted rounded mb-4" />

                {/* Tags */}
                <div className="flex gap-2 mb-4">
                    <div className="h-5 w-16 bg-muted rounded" />
                    <div className="h-5 w-20 bg-muted rounded" />
                </div>

                {/* Title */}
                <div className="h-10 w-full bg-muted rounded mb-4" />
                <div className="h-10 w-3/4 bg-muted rounded mb-6" />

                {/* Meta */}
                <div className="flex gap-4 mb-8">
                    <div className="h-6 w-32 bg-muted rounded" />
                    <div className="h-6 w-28 bg-muted rounded" />
                    <div className="h-6 w-24 bg-muted rounded" />
                </div>

                {/* Cover Image */}
                <div className="h-64 bg-muted rounded-2xl mb-8" />

                {/* Content skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-4 w-full bg-muted rounded" />
                    ))}
                    <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
            </div>
        </article>
    );
}
