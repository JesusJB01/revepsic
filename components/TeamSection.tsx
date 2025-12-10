"use client";
import React from "react";
import { FadeIn } from "@/components/animations";
import TeamMemberCard from "@/components/TeamMemberCard";
import type { TeamMember } from "@/lib/data/team";

interface TeamSectionProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    members: TeamMember[];
    gradientFrom: string;
    gradientTo: string;
}

export default function TeamSection({
    title,
    subtitle,
    icon,
    members,
    gradientFrom,
    gradientTo
}: TeamSectionProps) {
    return (
        <div className="mb-16 last:mb-0">
            <FadeIn>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-white shadow-lg`}>
                        {icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                        {title}
                    </h3>
                </div>
                <p className="text-muted-foreground mb-8 ml-13">
                    {subtitle}
                </p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {members.map((member, index) => (
                    <TeamMemberCard key={member.id} member={member} index={index} />
                ))}
            </div>
        </div>
    );
}
