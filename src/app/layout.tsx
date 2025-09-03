import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Agriconnect - Connecting Farmers and Agricultural Workers',
  description: 'Find reliable agricultural workers or discover farming opportunities in your area. Supporting English, Hindi, and Marathi.',
  keywords: ['agriculture', 'farming', 'workers', 'jobs', 'किसान', 'शेतकरी', 'कृषी'],
  authors: [{ name: 'Agriconnect Team' }],
  openGraph: {
    title: 'Agriconnect - Agricultural Labor Marketplace',
    description: 'Connecting farmers with skilled agricultural workers across India',
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['hi_IN', 'mr_IN'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}