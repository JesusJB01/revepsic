"use client";
import React from "react";

export function CardSkeleton() {
    return (
        <div className="p-6 bg-card rounded-2xl border border-border animate-pulse">
            <div className="h-12 w-12 rounded-xl bg-muted mb-4" />
            <div className="h-5 w-3/4 bg-muted rounded mb-2" />
            <div className="h-4 w-full bg-muted rounded mb-1" />
            <div className="h-4 w-2/3 bg-muted rounded" />
        </div>
    );
}

export function ArticleSkeleton() {
    return (
        <div className="p-6 bg-card rounded-2xl border border-border animate-pulse">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="h-4 w-24 bg-muted rounded mb-3" />
                    <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                    <div className="h-4 w-full bg-muted rounded mb-1" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
                <div className="h-5 w-5 bg-muted rounded" />
            </div>
        </div>
    );
}

export function TeamMemberSkeleton() {
    return (
        <div className="text-center animate-pulse">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted" />
            <div className="h-4 w-20 mx-auto bg-muted rounded mb-2" />
            <div className="h-3 w-16 mx-auto bg-muted rounded" />
        </div>
    );
}

export function StatSkeleton() {
    return (
        <div className="p-8 rounded-2xl bg-card border border-border animate-pulse text-center">
            <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-muted" />
            <div className="h-8 w-20 mx-auto bg-muted rounded mb-2" />
            <div className="h-4 w-24 mx-auto bg-muted rounded" />
        </div>
    );
}
