import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAccessToken, clearAuthTokens } from '../lib/api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const readStoredUser = () => {
        try {
            const stored = localStorage.getItem('ngulikang_user') || localStorage.getItem('userProfile');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    };

    const [user, setUser] = useState(() => {
        const token = getAccessToken();
        if (!token) {
            return null;
        }
        return readStoredUser();
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAccessToken()));

    const updateUser = (newUserData) => {
        setUser(newUserData);
        try {
            localStorage.setItem('userProfile', JSON.stringify(newUserData));
            localStorage.setItem('ngulikang_user', JSON.stringify(newUserData));
        } catch (e) {
            console.error("Failed to save user profile to localStorage", e);
        }
    };

    const logout = () => {
        clearAuthTokens();
        localStorage.removeItem('userProfile');
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            return;
        }

        setIsAuthenticated(true);
        if (!user) {
            setUser(readStoredUser());
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, updateUser, logout, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};
