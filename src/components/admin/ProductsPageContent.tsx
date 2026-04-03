'use client';

import { useTranslation } from '@/lib/i18n';

export function ProductsPageContent() {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-neutral-900">{t.admin.products}</h1>
      <p className="text-neutral-500 mt-1">{t.admin.products}</p>
    </div>
  );
}
