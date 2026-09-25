import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TrackingProvider } from './tracking';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://affiliate-funnel-os.example'),
  title: 'Affiliate Funnel OS — Practical funnel education and routing',
  description: 'A shared ClickFunnels affiliate funnel system with message-matched entry pages, segmentation, nurture controls, and explicit offer configuration.',
  openGraph: {
    title: 'Affiliate Funnel OS',
    description: 'Practical funnel education and routing.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affiliate Funnel OS',
    description: 'Practical funnel education and routing.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}<TrackingProvider />
      </body>
    </html>
  );
}
