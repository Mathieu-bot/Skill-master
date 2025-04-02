import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';
import assets from '../assets/assets';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUser(user);
            authService.setAuthHeader(user.token);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const register = async (name, email, password) => {
        try {
            const data = await authService.register(name, email, password);
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    };

    const forgotPassword = async (email) => {
        try {
            await authService.forgotPassword(email);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            await authService.resetPassword(token, password);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    };

    if (loading) {
        return (
        <div className='text-gray-950 dark:text-gray-200 bg-gray-300 dark:bg-gray-950 text-center h-lvh w-lvw flex flex-col justify-center items-center'>
            <div>{assets.isLoadingIcon}</div>
            <div>Chargement...</div>
        </div>
        );
    }

    // Créer une fonction wrapper pour isLoggedIn pour éviter les problèmes de contexte this
    const isUserLoggedIn = () => {
        const user = authService.getCurrentUser();
        return !!user && !!user.token;
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            register,
            forgotPassword,
            resetPassword,
            isLoggedIn: isUserLoggedIn
        }}>
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