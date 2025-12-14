"use client";
import React, { useEffect, useState, useCallback } from "react";
import { newsletterApi, Subscriber, NewsletterStats } from "@/lib/api";
import { Users, TrendingUp, TrendingDown, Mail, Clock, ChevronLeft, ChevronRight, Filter, Crown, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import RoleGuard from "@/components/auth/RoleGuard";
import { fetchSubscribersFromDb, fetchSubscriberStatsFromDb } from "@/lib/actions/admin-data";

type StatusFilter = '' | 'PENDING' | 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED';
type TierFilter = '' | 'FREE' | 'PREMIUM';

export default function SubscribersAdminPage() {
    const [stats, setStats] = useState<NewsletterStats | null>(null);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingTable, setIsLoadingTable] = useState(false);

    // Paginación
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Filtros
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
    const [tierFilter, setTierFilter] = useState<TierFilter>('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchStats = async () => {
        try {
            const stats = await fetchSubscriberStatsFromDb();
            if (stats) {
                // Convert to expected format
                setStats({
                    total: stats.total || 0,
                    byStatus: {
                        ACTIVE: stats.active || 0,
                        PENDING: stats.pending || 0,
                        UNSUBSCRIBED: stats.unsubscribed || 0,
                        BOUNCED: 0,
                    },
                    byTier: { FREE: 0, PREMIUM: 0 },
                    last30Days: 0,
                });
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchSubscribers = useCallback(async () => {
        setIsLoadingTable(true);
        try {
            const subs = await fetchSubscribersFromDb();
            if (subs) {
                setSubscribers(subs as Subscriber[]);
                setTotal(subs.length);
                setTotalPages(1); // No pagination with Prisma for now
            }
        } catch (error) {
            console.error("Error fetching subscribers:", error);
        }
        setIsLoadingTable(false);
    }, []);

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchStats(), fetchSubscribers()]);
            setIsLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            fetchSubscribers();
        }
    }, [page, statusFilter, tierFilter, fetchSubscribers, isLoading]);

    const handleTierChange = async (subscriberId: string, newTier: 'FREE' | 'PREMIUM') => {
        const response = await newsletterApi.updateTier(subscriberId, newTier);
        if (response.success) {
            // Actualizar localmente
            setSubscribers(prev =>
                prev.map(s => s.id === subscriberId ? { ...s, tier: newTier } : s)
            );
            // Refrescar stats
            fetchStats();
        }
    };

    const getStatusBadge = (status: Subscriber['status']) => {
        const styles = {
            PENDING: 'bg-yellow-500/10 text-yellow-500',
            ACTIVE: 'bg-green-500/10 text-green-500',
            UNSUBSCRIBED: 'bg-red-500/10 text-red-500',
            BOUNCED: 'bg-gray-500/10 text-gray-500',
        };
        const labels = {
            PENDING: 'Pendiente',
            ACTIVE: 'Activo',
            UNSUBSCRIBED: 'Cancelado',
            BOUNCED: 'Rebotado',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Suscriptores</h1>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-6 bg-card rounded-2xl border border-border animate-pulse">
                            <div className="h-8 w-16 bg-muted rounded mb-2" />
                            <div className="h-4 w-24 bg-muted rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Suscriptores</h1>
                    <p className="text-muted-foreground">Gestión del newsletter</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-6 bg-card rounded-2xl border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-500" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">{stats?.total || 0}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Total</p>
                    </div>

                    <div className="p-6 bg-card rounded-2xl border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">{stats?.byStatus.ACTIVE || 0}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Activos</p>
                    </div>

                    <div className="p-6 bg-card rounded-2xl border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-yellow-500" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">{stats?.byStatus.PENDING || 0}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Pendientes</p>
                    </div>

                    <div className="p-6 bg-card rounded-2xl border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <TrendingDown className="h-5 w-5 text-red-500" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">{stats?.byStatus.UNSUBSCRIBED || 0}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Cancelados</p>
                    </div>

                    <div className="p-6 bg-card rounded-2xl border border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Crown className="h-5 w-5 text-amber-500" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">{stats?.byTier.PREMIUM || 0}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Premium</p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por email o nombre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Filtros:</span>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
                            className="px-3 py-2 bg-card border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Todos los estados</option>
                            <option value="ACTIVE">Activos</option>
                            <option value="PENDING">Pendientes</option>
                            <option value="UNSUBSCRIBED">Cancelados</option>
                            <option value="BOUNCED">Rebotados</option>
                        </select>

                        <select
                            value={tierFilter}
                            onChange={(e) => { setTierFilter(e.target.value as TierFilter); setPage(1); }}
                            className="px-3 py-2 bg-card border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Todos los planes</option>
                            <option value="FREE">Gratis</option>
                            <option value="PREMIUM">Premium</option>
                        </select>

                        {(statusFilter || tierFilter || searchQuery) && (
                            <button
                                onClick={() => { setStatusFilter(''); setTierFilter(''); setSearchQuery(''); setPage(1); }}
                                className="text-sm text-primary hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Subscribers Table */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Nombre</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Estado</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Plan</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Fuente</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isLoadingTable ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 w-40 bg-muted rounded" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 bg-muted rounded" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-20 bg-muted rounded" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-20 bg-muted rounded" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                                        </tr>
                                    ))
                                ) : subscribers.length > 0 ? (
                                    subscribers
                                        .filter((subscriber) => {
                                            if (!searchQuery) return true;
                                            const query = searchQuery.toLowerCase();
                                            return (
                                                subscriber.email?.toLowerCase().includes(query) ||
                                                subscriber.name?.toLowerCase().includes(query)
                                            );
                                        })
                                        .map((subscriber) => (
                                            <tr key={subscriber.id} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-foreground">{subscriber.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-foreground">{subscriber.name || '-'}</td>
                                                <td className="px-6 py-4">{getStatusBadge(subscriber.status)}</td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={subscriber.tier}
                                                        onChange={(e) => handleTierChange(subscriber.id, e.target.value as 'FREE' | 'PREMIUM')}
                                                        disabled={subscriber.status !== 'ACTIVE'}
                                                        className="px-2 py-1 bg-muted border border-border rounded-lg text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <option value="FREE">Gratis</option>
                                                        <option value="PREMIUM">Premium</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground text-sm">{subscriber.source || '-'}</td>
                                                <td className="px-6 py-4 text-muted-foreground text-sm">
                                                    {format(new Date(subscriber.createdAt), "d MMM yyyy", { locale: es })}
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            No se encontraron suscriptores
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Mostrando página {page} de {totalPages} ({total} suscriptores)
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <span className="text-sm text-foreground px-3">{page}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </RoleGuard >
    );
}
