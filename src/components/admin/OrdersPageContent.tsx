'use client';

import { adminTranslations } from '@/lib/admin-translations';

export function OrdersPageContent() {
  const t = adminTranslations;

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{t.admin.orders}</h1>
      <p className="text-gray-600 mt-1">{t.admin.orders}</p>
    </div>
  );
}
