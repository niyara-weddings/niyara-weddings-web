'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContextProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ThemeContextProvider>
                <CssBaseline />
                {children}
            </ThemeContextProvider>
        </AuthProvider>
    );
}
