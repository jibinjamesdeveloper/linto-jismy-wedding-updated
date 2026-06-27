import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Linto & Jismy — July 22, 2026',
  description: 'Join us to celebrate the wedding of Linto and Jismy on 22nd July 2026 at Lourdes Matha Church, Mampuzhakary, Kerala.',
  keywords: ['wedding', 'Linto', 'Jismy', 'Kerala', 'Lourdes Matha Church'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Dancing+Script:wght@400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* suppressHydrationWarning prevents browser extension attribute mismatches (e.g. Grammarly) */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
