import { Suspense } from "react";
import { getAllPosts, getAllTags } from "@/lib/data/posts";
import PostsTable from "./posts-table";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Posts - Admin | REVEPSIC",
    description: "Gestiona los artículos del blog",
};

// Force dynamic rendering for admin
export const dynamic = "force-dynamic";

interface Props {
    searchParams: Promise<{
        page?: string;
        status?: string;
        tag?: string;
        q?: string;
    }>;
}

export default async function PostsAdminPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const status = params.status as "DRAFT" | "PUBLISHED" | undefined;
    const tag = params.tag;
    const searchQuery = params.q || "";

    // Fetch data using Prisma directly
    const [postsResult, tags] = await Promise.all([
        getAllPosts({
            page,
            limit: 10,
            status: status || undefined,
            tag: tag || undefined,
        }),
        getAllTags(),
    ]);

    return (
        <Suspense fallback={<PostsTableSkeleton />}>
            <PostsTable
                initialPosts={postsResult.posts}
                initialPagination={postsResult.pagination}
                tags={tags}
                currentPage={page}
                currentStatus={status || ""}
                currentTag={tag || ""}
                initialSearchQuery={searchQuery}
            />
        </Suspense>
    );
}

function PostsTableSkeleton() {
    return (
        <div className="space-y-6">
            <div className="h-10 bg-muted rounded-xl animate-pulse" />
            <div className="h-64 bg-muted rounded-xl animate-pulse" />
        </div>
    );
}
