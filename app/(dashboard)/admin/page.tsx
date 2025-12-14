"use client";
import React, { useEffect, useState } from "react";
import { DashboardOverview, Post } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";
import { FileText, Users, Eye, TrendingUp, Clock, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { fetchDashboardOverviewFromDb, fetchRecentPostsFromDb } from "@/lib/actions/admin-data";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [editorPosts, setEditorPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchData = async () => {
      if (isAdmin) {
        // Admin ve estadísticas completas (desde Prisma)
        const overview = await fetchDashboardOverviewFromDb();
        if (overview) {
          // Adaptar al formato esperado por el componente
          setData({
            posts: {
              total: overview.posts.total,
              published: overview.posts.published,
              drafts: overview.posts.draft,
            },
            subscribers: {
              total: overview.subscribers.total,
              premium: 0, // No disponible desde Prisma actualmente
              free: overview.subscribers.total, // Todo como free por ahora
            },
            authors: overview.authors.total, // Agregar authors
            totalViews: overview.views.total,
            recentPosts: [],
          });
          // Cargar posts recientes
          const recentPosts = await fetchRecentPostsFromDb(5);
          setData(prev => prev ? { ...prev, recentPosts: recentPosts as any } : null);
        } else {
          setError("Error al cargar datos");
        }
      } else {
        // Editor solo ve sus posts recientes
        try {
          const recentPosts = await fetchRecentPostsFromDb(10);
          setEditorPosts(recentPosts as Post[]);
        } catch {
          setError("Error al cargar posts");
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [isAdmin]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 bg-card rounded-2xl border border-border animate-pulse">
              <div className="h-12 w-12 rounded-xl bg-muted mb-4" />
              <div className="h-8 w-20 bg-muted rounded mb-2" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vista para EDITOR
  if (!isAdmin) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido, {user?.name}</p>
        </div>

        {/* Quick Stats for Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/posts"
            className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{editorPosts.length}</p>
            <p className="text-sm text-muted-foreground">Posts disponibles</p>
          </Link>

          <Link
            href="/admin/posts/nuevo"
            className="group p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className="h-12 w-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <p className="text-xl font-bold text-foreground mb-1">Crear Nuevo Post</p>
            <p className="text-sm text-muted-foreground">Escribe un nuevo artículo</p>
          </Link>
        </div>

        {/* Recent Posts for Editor */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Posts Recientes</h2>
            <Link href="/admin/posts" className="text-primary text-sm hover:underline">
              Ver todos
            </Link>
          </div>

          {editorPosts.length > 0 ? (
            <div className="space-y-4">
              {editorPosts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.status === 'PUBLISHED' ? (
                        post.publishedAt ? format(new Date(post.publishedAt), "d MMM yyyy", { locale: es }) : 'Publicado'
                      ) : (
                        <span className="text-amber-500">Borrador</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{post.viewCount}</span>
                    </div>
                    <Link
                      href={`/admin/posts/${post.slug}/editar`}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No tienes posts aún</p>
          )}
        </div>
      </div>
    );
  }

  // Vista para ADMIN (original)
  if (error || !data) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{error || "No hay datos disponibles"}</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Posts Publicados",
      value: data.posts.published,
      total: data.posts.total,
      icon: FileText,
      color: "bg-primary/10 text-primary",
      href: "/admin/posts",
    },
    {
      label: "Borradores",
      value: data.posts.drafts,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-500",
      href: "/admin/posts?status=DRAFT",
    },
    {
      label: "Suscriptores",
      value: data.subscribers.total,
      icon: Users,
      color: "bg-pink-500/10 text-pink-500",
      href: "/admin/suscriptores",
    },
    {
      label: "Vistas Totales",
      value: data.totalViews,
      icon: Eye,
      color: "bg-green-500/10 text-green-500",
      href: "/admin/metricas",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">
              {stat.value.toLocaleString()}
              {stat.total && (
                <span className="text-lg text-muted-foreground font-normal">
                  /{stat.total}
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Posts Recientes</h2>
          <Link href="/admin/posts" className="text-primary text-sm hover:underline">
            Ver todos
          </Link>
        </div>

        {data.recentPosts && data.recentPosts.length > 0 ? (
          <div className="space-y-4">
            {data.recentPosts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-muted rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{post.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.publishedAt
                      ? format(new Date(post.publishedAt), "d MMM yyyy", { locale: es })
                      : "Borrador"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{post.viewCount}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No hay posts recientes</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/posts/nuevo"
          className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-border hover:border-primary/50 transition-all group"
        >
          <TrendingUp className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold text-foreground mb-2">Nuevo Post</h3>
          <p className="text-sm text-muted-foreground">Crear un nuevo artículo</p>
        </Link>

        <Link
          href="/admin/autores"
          className="p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all group"
        >
          <Users className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold text-foreground mb-2">Gestionar Autores</h3>
          <p className="text-sm text-muted-foreground">Administrar perfiles de autores</p>
        </Link>

        <Link
          href="/admin/metricas"
          className="p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all group"
        >
          <Eye className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold text-foreground mb-2">Ver Métricas</h3>
          <p className="text-sm text-muted-foreground">Analíticas detalladas</p>
        </Link>
      </div>
    </div>
  );
}
