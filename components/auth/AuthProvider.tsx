"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, getAccessToken, clearTokens } from '@/lib/api';

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
                console.log('[Auth] Checking existing session...');
                const response = await authApi.getMe();

                if (response.success && response.data) {
                    console.log('[Auth] Session valid:', response.data);
                    setUser(response.data as User);
                } else {
                    console.log('[Auth] Session invalid, clearing tokens');
                    clearTokens();
                }
            } catch (error) {
                console.error('[Auth] Session check failed:', error);
                clearTokens();
            }

            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            console.log('[Auth] Attempting login for:', email);
            const response = await authApi.login(email, password);
            console.log('[Auth] Login response:', response);

            if (response.success && response.data) {
                // User is in response.data.user
                const userData = (response.data as { user?: User }).user;
                if (userData) {
                    setUser(userData);
                    console.log('[Auth] User set from login response:', userData);
                }
                return { success: true };
            }

            console.log('[Auth] Login failed:', response.message);
            return { success: false, message: response.message || 'Credenciales incorrectas' };
        } catch (error) {
            console.error('[Auth] Login error:', error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    };

    const logout = async () => {
        await authApi.logout();
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
