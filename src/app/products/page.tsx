import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Layout } from '@/components/layout/Layout';
import { ProductList } from '@/components/products/ProductList';
import { ProductFilters } from '@/components/products/ProductFilters';

export const dynamic = 'force-dynamic';

async function getProducts(searchParams: {
  category?: string;
  brand?: string;
  min_price?: string;
  max_price?: string;
  sort?: string;
  search?: string;
  page?: string;
}) {
  const client = getSupabaseClient();
  
  let query = client
    .from('products')
    .select('*, categories(name), brands(name, logo)', { count: 'exact' })
    .eq('is_active', true);

  // Filter by category
  if (searchParams.category) {
    query = query.eq('categories.slug', searchParams.category);
  }

  // Filter by brand
  if (searchParams.brand) {
    query = query.eq('brands.slug', searchParams.brand);
  }

  // Search
  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`);
  }

  // Price range
  if (searchParams.min_price) {
    query = query.gte('retail_price', searchParams.min_price);
  }
  if (searchParams.max_price) {
    query = query.lte('retail_price', searchParams.max_price);
  }

  // Sort
  switch (searchParams.sort) {
    case 'price_asc':
      query = query.order('retail_price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('retail_price', { ascending: false });
      break;
    case 'sales':
      query = query.order('sales_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Pagination
  const page = parseInt(searchParams.page || '1');
  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;
  
  if (error) throw error;
  
  return {
    products: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

async function getCategories() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

async function getBrands() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    min_price?: string;
    max_price?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const [{ products, total, page, pageSize, totalPages }, categories, brands] = await Promise.all([
    getProducts(params),
    getCategories(),
    getBrands(),
  ]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <ProductFilters
              categories={categories}
              brands={brands}
              selectedCategory={params.category}
              selectedBrand={params.brand}
              minPrice={params.min_price}
              maxPrice={params.max_price}
            />
          </div>

          {/* Product List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {total} products found
              </p>
              <ProductSort currentSort={params.sort} />
            </div>
            
            <ProductList
              products={products}
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ProductSort({ currentSort }: { currentSort?: string }) {
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
