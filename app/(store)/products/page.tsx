import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/store/product-grid'

export const metadata = {
  title: 'All Products',
  description: 'Browse our complete collection of electronics, mobiles, laptops, and more.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sale?: string; sort?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('active', true)

  // Filter by sale
  if (params.sale === 'true') {
    query = query.not('sale_price', 'is', null)
  }

  // Sort
  switch (params.sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data: products } = await query

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductGrid 
        products={products || []} 
        title="allProducts"
        showFilters
      />
    </div>
  )
}
