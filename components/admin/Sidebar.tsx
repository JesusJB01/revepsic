"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
    LayoutDashboard,
    FileText,
    Users,
    UserCircle,
    Tags,
    Mail,
    BarChart3,
    LogOut,
    Menu,
    X,
    ChevronLeft,
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ['ADMIN', 'EDITOR', 'VIEWER'] },
    { name: "Posts", href: "/admin/posts", icon: FileText, roles: ['ADMIN', 'EDITOR'] },
    { name: "Autores", href: "/admin/autores", icon: UserCircle, roles: ['ADMIN'] },
    { name: "Tags", href: "/admin/tags", icon: Tags, roles: ['ADMIN'] },
    { name: "Usuarios", href: "/admin/usuarios", icon: Users, roles: ['ADMIN'] },
    { name: "Suscriptores", href: "/admin/suscriptores", icon: Mail, roles: ['ADMIN'] },
    { name: "Métricas", href: "/admin/metricas", icon: BarChart3, roles: ['ADMIN'] },
];

export default function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="fixed top-4 left-4 z-50 lg:hidden h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    {!isCollapsed && (
                        <Link href="/admin" className="flex items-center gap-2">
                            <Image src="/favicon.svg" alt="REVEPSIC" width={32} height={32} />
                            <span className="font-bold text-lg">
                                <span className="text-foreground">REVEP</span>
                                <span className="text-primary">SIC</span>
                            </span>
                        </Link>
                    )}
                    {isCollapsed && (
                        <Image src="/favicon.svg" alt="REVEPSIC" width={32} height={32} className="mx-auto" />
                    )}

                    {/* Collapse button - desktop only */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                    >
                        <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
                    </button>

                    {/* Close button - mobile only */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems
                        .filter((item) => user?.role && item.roles.includes(user.role))
                        .map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                  ${isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {!isCollapsed && <span className="font-medium">{item.name}</span>}
                                </Link>
                            );
                        })}
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-border">
                    {!isCollapsed && user && (
                        <div className="mb-3 px-3">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-foreground text-sm truncate">{user.name}</p>
                                <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' :
                                        user.role === 'EDITOR' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-gray-500/10 text-gray-500'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all
              ${isCollapsed ? "justify-center" : ""}
            `}
                    >
                        <LogOut className="h-5 w-5" />
                        {!isCollapsed && <span className="font-medium">Cerrar sesión</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
