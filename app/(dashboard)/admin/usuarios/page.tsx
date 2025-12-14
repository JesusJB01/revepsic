"use client";
import React, { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { Plus, UserCheck, UserX, Shield, Trash2 } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import { toast } from "sonner";
import { fetchUsersFromDb } from "@/lib/actions/admin-data";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export default function UsersAdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        name: "",
        role: "VIEWER",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const users = await fetchUsersFromDb();
            if (users) {
                setUsers(users as User[]);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        }
        setIsLoading(false);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await authApi.createUser(newUser);
        if (response.success) {
            setShowModal(false);
            setNewUser({ email: "", password: "", name: "", role: "VIEWER" });
            fetchUsers();
            toast.success("Usuario creado correctamente");
        } else {
            toast.error("Error al crear usuario", { description: response.message });
        }
    };

    const handleToggleStatus = async (id: string, isActive: boolean) => {
        const response = await authApi.updateUserStatus(id, !isActive);
        if (response.success) {
            setUsers((users || []).map((u) => (u.id === id ? { ...u, isActive: !isActive } : u)));
        }
    };

    // Soft delete - Desactivar usuario (preserva integridad referencial)
    const handleDeactivateUser = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de desactivar a ${name}? El usuario no podrá iniciar sesión pero sus datos se conservarán.`)) return;

        const response = await authApi.updateUserStatus(id, false);
        if (response.success) {
            setUsers((users || []).map((u) => (u.id === id ? { ...u, isActive: false } : u)));
            toast.success(`${name} desactivado correctamente`);
        } else {
            toast.error("Error al desactivar usuario");
        }
    };

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            ADMIN: "bg-red-500/10 text-red-500",
            EDITOR: "bg-blue-500/10 text-blue-500",
            VIEWER: "bg-gray-500/10 text-gray-500",
        };
        return colors[role] || colors.VIEWER;
    };

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
                        <p className="text-muted-foreground">Gestiona los usuarios del sistema</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Nuevo Usuario
                    </button>
                </div>

                {/* Table */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mx-auto" />
                        </div>
                    ) : !users || users.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No hay usuarios registrados
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Usuario</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rol</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {(users || []).map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-foreground">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                                                    <Shield className="h-3 w-3" />
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                    }`}>
                                                    {user.isActive ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                                                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg transition-colors ${user.isActive
                                                            ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                                            : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                            }`}
                                                    >
                                                        {user.isActive ? (
                                                            <><UserX className="h-3 w-3" /> Desactivar</>
                                                        ) : (
                                                            <><UserCheck className="h-3 w-3" /> Activar</>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Create User Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-foreground mb-6">Nuevo Usuario</h2>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Nombre</label>
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                                        required
                                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Email</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                                        required
                                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Contraseña</label>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                                        required
                                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Rol</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="VIEWER">Viewer</option>
                                        <option value="EDITOR">Editor</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-2 bg-muted text-foreground font-medium rounded-xl hover:bg-accent transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 gradient-bg text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-all"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}
