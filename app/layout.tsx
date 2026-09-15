import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AppProviders } from '@/lib/providers/AppProviders';

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'RAHAT — Landslide Hazard Intelligence Platform',
  description: 'Landslide monitoring, multi-window hazard nowcasting, and disaster decision-support system for Northeast India.',
  keywords: ['landslide hazard nowcast', 'disaster decision support', 'Northeast India', 'RAHAT'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`light ${jakartaSans.variable}`}>
      <body className={`${jakartaSans.className} min-h-screen bg-sand-100 dark:bg-earth-900 text-earth-900 dark:text-earth-100 flex flex-col antialiased transition-colors`}>
        <AppProviders>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
