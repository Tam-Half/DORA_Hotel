import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const token = authService.getToken();
            if (token) {
                const response = await userService.getProfile();
                setUser(response);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            authService.logout();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        await fetchProfile();
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const register = async (userData) => {
        const data = await userService.create(userData);
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
