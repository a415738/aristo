'use client';

import { adminTranslations } from '@/lib/admin-translations';

export function BrandsPageContent() {
  const t = adminTranslations;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t.admin.brands}</h1>
        <p className="text-gray-600 mt-1">{t.admin.brands}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>{t.common.required}：</strong>{t.admin.brands}
          </p>
        </div>
      </div>
    </div>
  );
}
