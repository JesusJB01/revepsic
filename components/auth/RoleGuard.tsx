'use client';
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ShieldX } from 'lucide-react';
import Link from 'next/link';

type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

interface RoleGuardProps {
    allowedRoles: Role[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
    const { user, isLoading } = useAuth();

    // Mientras carga, mostrar spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    // Si el usuario tiene el rol permitido, mostrar contenido
    if (user?.role && allowedRoles.includes(user.role as Role)) {
        return <>{children}</>;
    }

    // Si tiene un componente fallback personalizado, usarlo
    if (fallback) {
        return <>{fallback}</>;
    }

    // Por defecto, mostrar mensaje de acceso denegado
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
                <ShieldX className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
                Acceso Denegado
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                No tienes permisos para acceder a esta sección.
                {user?.role === 'EDITOR' && ' Los editores solo pueden gestionar posts.'}
                {user?.role === 'VIEWER' && ' Tu rol es de solo lectura.'}
            </p>
            <Link
                href="/admin"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
            >
                Volver al Dashboard
            </Link>
        </div>
    );
}

// Hook para verificar si el usuario tiene un rol específico
export function useHasRole(roles: Role | Role[]): boolean {
    const { user } = useAuth();
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return !!(user?.role && allowedRoles.includes(user.role as Role));
}

// Hook para verificar si es admin
export function useIsAdmin(): boolean {
    return useHasRole('ADMIN');
}

// Hook para verificar si es editor o admin
export function useCanEditPosts(): boolean {
    return useHasRole(['ADMIN', 'EDITOR']);
}
