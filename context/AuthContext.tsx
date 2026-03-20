import React, { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';
import { storage } from '../utils/storage';

interface User {
    id: string;
    email: string;
    age: number;
    gender: 'male' | 'female';
    agent?: Agent;
}

interface Agent {
    id: string;
    name: string;
    age: number;
    personality: 'romantic' | 'friend' | 'emotional';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (token: string, userData?: User) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        try {
            const token = await storage.getItem('userToken');
            if (token) {
                // Fetch current user from /api/v1/auth/me
                const response = await client.get('/api/v1/auth/me');
                setUser(response.data);
            }
        } catch (e) {
            console.log('Failed to load user', e);
        } finally {
            setIsLoading(false);
        }
    }

    async function signIn(token: string, userData?: User) {
        await storage.setItem('userToken', token);
        if (userData) {
            setUser(userData);
        } else {
            try {
                // Fetch the current user info separately since it's missing from the auth response
                const response = await client.get('/api/v1/auth/me');
                setUser(response.data);
            } catch (e) {
                console.error('Failed to load user info after sign-in', e);
            }
        }
    }

    async function signOut() {
        await storage.deleteItem('userToken');
        setUser(null);
    }

    function updateUser(userData: User) {
        setUser(userData);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
