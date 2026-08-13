'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContextProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AppRouterCacheProvider>
            <AuthProvider>
                <ThemeContextProvider>
                    <CssBaseline />
                    {children}
                </ThemeContextProvider>
            </AuthProvider>
        </AppRouterCacheProvider>
    );
}
