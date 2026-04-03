'use client';

import { useTranslation } from '@/lib/i18n';

export function OrdersPageContent() {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{t.admin.orders}</h1>
      <p className="text-gray-600 mt-1">{t.admin.orders}</p>
    </div>
  );
}
