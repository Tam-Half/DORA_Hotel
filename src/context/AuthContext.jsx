import React, { createContext, useContext, useState, useEffect } from 'react';
import authAPI from '../services/auth';
import userAPI from '../services/user';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const token = authAPI.getToken();
            if (token) {
                const response = await userAPI.getProfile();
                localStorage.setItem('user_profile', JSON.stringify(response));
                setUser(response);

            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            authAPI.logout();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const login = async (credentials) => {
        const data = await authAPI.login(credentials);
        await fetchProfile();
        return data;
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    const register = async (userData) => {
        const data = await userAPI.create(userData);
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
