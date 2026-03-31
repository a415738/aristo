'use client';

export function ProductSort({ currentSort }: { currentSort?: string }) {
  const options = [
    { value: '', label: 'Newest' },
    { value: 'sales', label: 'Best Sellers' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ];

  return (
    <select
      className="px-4 py-2 border rounded-lg bg-white"
      defaultValue={currentSort || ''}
      onChange={(e) => {
        const url = new URL(window.location.href);
        if (e.target.value) {
          url.searchParams.set('sort', e.target.value);
        } else {
          url.searchParams.delete('sort');
        }
        window.location.href = url.toString();
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
