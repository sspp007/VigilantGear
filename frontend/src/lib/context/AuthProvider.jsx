import { useCallback, useMemo, useState } from 'react';
import * as authService from '@/lib/api/authService';
import { USER_ROLES } from '@/lib/constants/roles';
import { AuthContext } from '@/lib/context/authContext';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => authService.getSessionUser());

    const login = useCallback(async (credentials) => {
        const signedInUser = await authService.login(credentials);
        setUser(signedInUser);
        return signedInUser;
    }, []);

    const loginWithProvider = useCallback(async (providerName) => {
        const signedInUser = await authService.loginWithProvider(providerName);
        setUser(signedInUser);
        return signedInUser;
    }, []);

    const signup = useCallback(async (details) => {
        const createdUser = await authService.signup(details);
        setUser(createdUser);
        return createdUser;
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            isAdmin: user?.role === USER_ROLES.ADMIN,
            login,
            loginWithProvider,
            signup,
            logout,
        }),
        [user, login, loginWithProvider, signup, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}