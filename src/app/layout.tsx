import React from 'react';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: "Niyara Weddings",
  description: "Plan your perfect wedding",
  icons: {
    icon: [
      { url: "/favicon.ico?v=niyara-2", sizes: "any" },
      { url: "/favicon.svg?v=niyara-2", type: "image/svg+xml" },
      { url: "/favicon-32.png?v=niyara-2", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=niyara-2",
    apple: "/favicon-192.png?v=niyara-2",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
