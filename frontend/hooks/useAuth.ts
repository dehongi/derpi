import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const token = Cookies.get('token');
            setIsAuthenticated(!!token);
            setLoading(false);
        };

        checkAuth();
        // Listen for storage events to sync across tabs (optional but good practice)
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const logout = () => {
        Cookies.remove('token');
        setIsAuthenticated(false);
        router.push('/login');
        router.refresh(); // Refresh to update UI
    };

    return { isAuthenticated, loading, logout };
}
