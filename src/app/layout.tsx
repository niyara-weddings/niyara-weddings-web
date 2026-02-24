import React from 'react';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: "Niyara Weddings",
  description: "Plan your perfect wedding",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon-192.png",
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
