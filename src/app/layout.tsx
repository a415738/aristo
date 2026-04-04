import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { AutoI18nProvider } from '@/lib/i18n/auto-provider';
import { CurrencyProvider } from '@/lib/currency-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aristo-Beauty Capital',
  description: 'Beauty Capital - Premium Beauty Products in Southeast Asia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <AutoI18nProvider>
          <CurrencyProvider>
            {children}
            <ChatWidget />
          </CurrencyProvider>
        </AutoI18nProvider>
      </body>
    </html>
  );
}
