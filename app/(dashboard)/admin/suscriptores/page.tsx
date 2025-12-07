"use client";
import React, { useEffect, useState } from "react";
import { dashboardApi, SubscriberAnalytics } from "@/lib/api";
import { Users, TrendingUp, TrendingDown, Mail } from "lucide-react";

export default function SubscribersAdminPage() {
    const [data, setData] = useState<SubscriberAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await dashboardApi.getSubscriberAnalytics(30);
            if (response.success && response.data) {
                setData(response.data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Suscriptores</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-6 bg-card rounded-2xl border border-border animate-pulse">
                            <div className="h-8 w-16 bg-muted rounded mb-2" />
                            <div className="h-4 w-24 bg-muted rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">No hay datos disponibles</p>
            </div>
        );
    }

    const totalActive = data.byStatus.ACTIVE || 0;
    const totalUnsubscribed = data.byStatus.UNSUBSCRIBED || 0;
    const totalFree = data.byTier?.FREE || 0;
    const totalPremium = data.byTier?.PREMIUM || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Suscriptores</h1>
                <p className="text-muted-foreground">Estadísticas del newsletter</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 bg-card rounded-2xl border border-border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">{totalActive}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Activos</p>
                </div>

                <div className="p-6 bg-card rounded-2xl border border-border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <TrendingDown className="h-5 w-5 text-red-500" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">{totalUnsubscribed}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Cancelados</p>
                </div>

                <div className="p-6 bg-card rounded-2xl border border-border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">{totalFree}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Plan Gratis</p>
                </div>

                <div className="p-6 bg-card rounded-2xl border border-border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">{totalPremium}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Plan Premium</p>
                </div>
            </div>

            {/* Growth chart placeholder */}
            <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Crecimiento (últimos 30 días)</h2>
                {data.growth && data.growth.length > 0 ? (
                    <div className="space-y-2">
                        {data.growth.slice(0, 10).map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground w-24">{item.date}</span>
                                <div className="flex-1 bg-muted rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: `${Math.min(100, item.signups * 10)}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-foreground w-8">{item.signups}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-8">No hay datos de crecimiento</p>
                )}
            </div>

            {/* Top sources */}
            {data.topSources && data.topSources.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Fuentes principales</h2>
                    <div className="space-y-3">
                        {data.topSources.map((source, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                                <span className="text-foreground">{source.source}</span>
                                <span className="text-muted-foreground">{source.count} suscriptores</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
