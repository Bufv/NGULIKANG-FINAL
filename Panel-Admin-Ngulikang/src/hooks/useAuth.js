import { useState, useEffect } from 'react';
import { getAccessToken } from 'lib/api';

// ==============================|| AUTH HOOKS ||============================== //

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // Also check synchronously for initial render to prevent flash
    const token = getAccessToken();
    return { isLoggedIn: Boolean(token) };
};
