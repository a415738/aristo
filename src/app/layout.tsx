import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ChatWidget } from '@/components/chat/ChatWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aristo - 东南亚美妆购物平台',
  description: '汇聚全球知名美妆品牌，品质保证，正品低价，支持东南亚多国配送。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
