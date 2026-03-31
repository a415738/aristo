import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ChatWidget } from '@/components/chat/ChatWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BeautyMart - Southeast Asia Beauty B2B2C Platform',
  description: 'Premium beauty products from top brands. Wholesale and retail available across Southeast Asia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
