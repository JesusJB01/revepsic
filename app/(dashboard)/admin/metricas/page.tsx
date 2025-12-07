"use client";
import React, { useEffect, useState } from "react";
import { dashboardApi, PostAnalytics, SubscriberAnalytics } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Eye, TrendingUp, Users, Activity } from "lucide-react";

export default function MetricsPage() {
    const [postData, setPostData] = useState<PostAnalytics | null>(null);
    const [subscriberData, setSubscriberData] = useState<SubscriberAnalytics | null>(null);
    const [apiHealth, setApiHealth] = useState<{
        totalRequests: number;
        avgResponseTime: number;
        errorRate: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [days, setDays] = useState(30);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [postsRes, subsRes, healthRes] = await Promise.all([
                dashboardApi.getPostAnalytics(days),
                dashboardApi.getSubscriberAnalytics(days),
                dashboardApi.getApiHealth(24),
            ]);

            if (postsRes.success && postsRes.data) setPostData(postsRes.data);
            if (subsRes.success && subsRes.data) setSubscriberData(subsRes.data);
            if (healthRes.success && healthRes.data) setApiHealth(healthRes.data as typeof apiHealth);

            setIsLoading(false);
        };
        fetchData();
    }, [days]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-6 bg-card rounded-2xl border border-border animate-pulse h-32" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
                    <p className="text-muted-foreground">Analíticas detalladas del blog</p>
                </div>
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value={7}>Últimos 7 días</option>
                    <option value={30}>Últimos 30 días</option>
                    <option value={90}>Últimos 90 días</option>
                </select>
            </div>

            {/* API Health Stats */}
            {apiHealth && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 bg-card rounded-2xl border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{apiHealth.totalRequests}</p>
                                <p className="text-sm text-muted-foreground">Peticiones (24h)</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-card rounded-2xl border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{apiHealth.avgResponseTime}ms</p>
                                <p className="text-sm text-muted-foreground">Tiempo promedio</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-card rounded-2xl border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${apiHealth.errorRate < 0.05 ? "bg-green-500/10" : "bg-red-500/10"
                                }`}>
                                <Eye className={`h-5 w-5 ${apiHealth.errorRate < 0.05 ? "text-green-500" : "text-red-500"}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{(apiHealth.errorRate * 100).toFixed(2)}%</p>
                                <p className="text-sm text-muted-foreground">Tasa de error</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Views Over Time Chart */}
            {postData?.viewsOverTime && postData.viewsOverTime.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Vistas en el tiempo</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={postData.viewsOverTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--muted-foreground)"
                                    fontSize={12}
                                    tickFormatter={(value) => value.slice(5)}
                                />
                                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--card)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "12px",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#fbbf24"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Posts by Status */}
            {postData?.byStatus && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card rounded-2xl border border-border p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-6">Posts por Estado</h2>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: "Publicados", value: postData.byStatus.PUBLISHED || 0 },
                                    { name: "Borradores", value: postData.byStatus.DRAFT || 0 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--card)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "12px",
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#fbbf24" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Subscriber Growth */}
                    {subscriberData?.growth && subscriberData.growth.length > 0 && (
                        <div className="bg-card rounded-2xl border border-border p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-6">Crecimiento de Suscriptores</h2>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={subscriberData.growth}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="var(--muted-foreground)"
                                            fontSize={12}
                                            tickFormatter={(value) => value.slice(5)}
                                        />
                                        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "var(--card)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "12px",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="signups"
                                            stroke="#ec4899"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Top Posts */}
            {postData?.topPosts && postData.topPosts.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Posts más vistos</h2>
                    <div className="space-y-3">
                        {postData.topPosts.slice(0, 5).map((post, index) => (
                            <div key={post.id} className="flex items-center gap-4 p-3 bg-muted rounded-xl">
                                <span className="text-lg font-bold text-primary w-8">{index + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">{post.title}</p>
                                    <p className="text-sm text-muted-foreground">{post.author?.name}</p>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Eye className="h-4 w-4" />
                                    <span>{post.viewCount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
