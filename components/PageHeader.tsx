"use client";
import React from "react";
import Image from "next/image";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    imageSrc: string;
    imageAlt: string;
}

export default function PageHeader({ title, subtitle, imageSrc, imageAlt }: PageHeaderProps) {
    return (
        <header className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
            {/* Background Image */}
            <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end">
                <div className="container pb-8 md:pb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </header>
    );
}
