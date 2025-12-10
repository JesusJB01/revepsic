import { Metadata } from "next";
import { notFound } from "next/navigation";
import MemberProfile from "@/components/MemberProfile";
import { getMemberBySlug, getAllMemberSlugs } from "@/lib/data/team";

// Revalidate every hour by default
export const revalidate = 3600;

// Pre-generate pages for all members at build time
export async function generateStaticParams() {
    const slugs = await getAllMemberSlugs();
    return slugs.map((slug) => ({ slug }));
}

// Dynamic metadata for SEO & social sharing
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const member = await getMemberBySlug(slug);

    if (!member) {
        return {
            title: "Miembro no encontrado | REVEPSIC",
        };
    }

    const title = `${member.name} | REVEPSIC`;
    const description = `${member.name} - ${member.position} en REVEPSIC. ${member.bio.slice(0, 100)}...`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "profile",
            images: [
                {
                    url: member.image,
                    width: 400,
                    height: 400,
                    alt: member.name,
                },
            ],
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: [member.image],
        },
    };
}

// Page Component (Server Component)
export default async function MemberProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const member = await getMemberBySlug(slug);

    if (!member) {
        notFound();
    }

    return <MemberProfile member={member} />;
}
