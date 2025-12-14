"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, getAccessToken, clearTokens } from '@/lib/api';
import { saveAuthToken, clearAuthToken } from '@/lib/actions/auth';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = getAccessToken();

            // If no token, skip auth check
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await authApi.getMe();

                if (response.success && response.data) {
                    setUser(response.data as User);
                } else {
                    clearTokens();
                }
            } catch {
                clearTokens();
            }

            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login(email, password);

            if (response.success && response.data) {
                const userData = (response.data as { user?: User }).user;
                if (userData) {
                    setUser(userData);
                }

                // IMPORTANT: Save token to cookies for Server Actions
                const token = getAccessToken();
                if (token) {
                    await saveAuthToken(token);
                }

                return { success: true };
            }

            return { success: false, message: response.message || 'Credenciales incorrectas' };
        } catch {
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    };

    const logout = async () => {
        await authApi.logout();
        await clearAuthToken(); // Clear cookie
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
